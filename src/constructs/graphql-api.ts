import { join } from 'path';
import * as appsync from '@aws-cdk/aws-appsync-alpha';
import { Aws, aws_iam as iam, aws_lambda_nodejs as lambdaNodejs, aws_secretsmanager as sm } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export interface GraphQLApiProps {
  workshopAttendeeRoleName: string;
}

export class GraphQLApi extends Construct {
  constructor(scope: Construct, id: string, props: GraphQLApiProps) {
    super(scope, id);

    const clerkApiKey = sm.Secret.fromSecretAttributes(this, 'ClerkApiKey', {
      secretPartialArn: `arn:aws:secretsmanager:${Aws.REGION}:${Aws.ACCOUNT_ID}:secret:clerk/backend-api-key`,
    });

    const authorizerFunction = new lambdaNodejs.NodejsFunction(this, 'AuthorizerFunction', {
      entry: join(__dirname, '../functions/appsync-authorizer.ts'),
      environment: {
        CLERK_API_KEY: clerkApiKey.secretValue.toString(),
      },
    });
    authorizerFunction.grantInvoke(new iam.ServicePrincipal('appsync.amazonaws.com'));

    const cloudWatchLogsRole = new iam.Role(this, 'ApiLogsRole', {
      assumedBy: new iam.ServicePrincipal('appsync.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSAppSyncPushToCloudWatchLogs'),
      ],
    });

    const api = new appsync.GraphqlApi(this, 'Api', {
      name: 'WorkshopEngineApi',
      schema: appsync.Schema.fromAsset(join(__dirname, '../../schema.graphql')),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.LAMBDA,
          lambdaAuthorizerConfig: {
            handler: authorizerFunction,
          },
        },
      },
      xrayEnabled: true,
      logConfig: {
        fieldLogLevel: appsync.FieldLogLevel.ERROR,
        role: cloudWatchLogsRole,
      },
    });

    const awsSignInUrlFunction = new lambdaNodejs.NodejsFunction(this, 'AwsSignInUrlFunction', {
      entry: join(__dirname, '../functions/aws-sign-in-url.ts'),
      environment: {
        WORKSHOP_ATTENDEE_ROLE_NAME: props.workshopAttendeeRoleName,
      },
    });
    awsSignInUrlFunction.addToRolePolicy(new iam.PolicyStatement({
      actions: ['sts:AssumeRole'],
      resources: [`arn:aws:iam::*:role/${props.workshopAttendeeRoleName}`],
    }));

    const awsSignInUrlDataSource = api.addLambdaDataSource('AwsSignInUrlDataSource', awsSignInUrlFunction);
    awsSignInUrlDataSource.createResolver({
      typeName: 'Mutation',
      fieldName: 'createAwsSignInUrl',
    });
  }
}
