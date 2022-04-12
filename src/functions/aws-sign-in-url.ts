import { STS } from '@aws-sdk/client-sts';
import fetch from 'node-fetch';
import { ResolverContext } from '../config';

interface Arguments {
  awsAccountId: string;
}

const region = process.env.AWS_REGION;
const consoleUrl = `https://${region}.console.aws.amazon.com`;
const signinEndpoint = 'https://signin.aws.amazon.com/federation';
const durationSeconds = 60 * 60 * 8;

const client = new STS({
  region,
  credentials: {
    accessKeyId: process.env.SIGN_IN_USER_ACCESS_KEY_ID!,
    secretAccessKey: process.env.SIGN_IN_USER_SECRET_ACCESS_KEY!,
  },
});

export const handler: AWSLambda.AppSyncResolverHandler<Arguments, string> = async (event) => {
  const identity = event.identity as AWSLambda.AppSyncIdentityLambda;
  const user = identity.resolverContext as ResolverContext;
  const awsAccountId = event.arguments.awsAccountId;
  const roleName = process.env.WORKSHOP_ATTENDEE_ROLE_NAME || '';

  const assumedRole = await client.assumeRole({
    RoleArn: `arn:aws:iam::${awsAccountId}:role/${roleName}`,
    RoleSessionName: user.emailAddress,
    DurationSeconds: durationSeconds,
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
