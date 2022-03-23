import { STS } from '@aws-sdk/client-sts';
import fetch from 'node-fetch';

interface Arguments {
  awsAccountId: string;
  emailAddress: string;
}

const region = process.env.AWS_REGION;
const consoleUrl = `https://${region}.console.aws.amazon.com`;
const signinEndpoint = 'https://signin.aws.amazon.com/federation';

const client = new STS({ region });

export const handler: AWSLambda.AppSyncResolverHandler<Arguments, string> = async (event) => {
  const awsAccountId = event.arguments.awsAccountId;
  const roleName = process.env.WORKSHOP_ATTENDEE_ROLE_NAME || '';

  const assumedRole = await client.assumeRole({
    RoleArn: `arn:aws:iam::${awsAccountId}:role/${roleName}`,
    RoleSessionName: event.arguments.emailAddress,
  });

  if (!assumedRole.Credentials) {
    throw new Error('No credentials');
  }

  const session = JSON.stringify({
    sessionId: assumedRole.Credentials.AccessKeyId,
    sessionKey: assumedRole.Credentials.SecretAccessKey,
    sessionToken: assumedRole.Credentials.SessionToken,
  });

  const url = `${signinEndpoint}?Action=getSigninToken&SessionType=json&Session=${encodeURIComponent(session)}`;
  const response = await fetch(url);
  const body = await response.json();

  return `${signinEndpoint}?Action=login&SigninToken=${encodeURIComponent(body.SigninToken)}&Destination=${encodeURIComponent(consoleUrl)}`;
};
