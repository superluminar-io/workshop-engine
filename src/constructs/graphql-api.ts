import { join } from 'path';
import * as appsync from '@aws-cdk/aws-appsync-alpha';
import { Aws, aws_iam as iam, aws_lambda_nodejs as lambdaNodejs, aws_secretsmanager as sm, aws_dynamodb as dynamodb, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as mappingTemplates from '../vtl';

export interface GraphQLApiProps {
  workshopAttendeeRoleName: string;
}

export class GraphQLApi extends Construct {
  constructor(scope: Construct, id: string, props: GraphQLApiProps) {
    super(scope, id);

    const awsSignInUrlUser = new iam.User(this, 'AwsSignInUrlUser');
    awsSignInUrlUser.addToPolicy(new iam.PolicyStatement({
      actions: ['sts:AssumeRole'],
      resources: [`arn:aws:iam::*:role/${props.workshopAttendeeRoleName}`],
    }));
    const awsSignInUrlUserAccessKey = new iam.AccessKey(this, 'AwsSignInUrlUserAccessKey', { user: awsSignInUrlUser });

    const clerkApiKey = sm.Secret.fromSecretAttributes(this, 'ClerkApiKey', {
      secretPartialArn: `arn:aws:secretsmanager:${Aws.REGION}:${Aws.ACCOUNT_ID}:secret:clerk/backend-api-key`,
    });

    const workshopsTable = new dynamodb.Table(this, 'WorkshopsTable', {
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });
    workshopsTable.addGlobalSecondaryIndex({
      indexName: 'byNode',
      partitionKey: {
        name: 'node',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'createdAt',
        type: dynamodb.AttributeType.STRING,
      },
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
        additionalAuthorizationModes: [
          {
            authorizationType: appsync.AuthorizationType.API_KEY,
          },
        ],
      },
      xrayEnabled: true,
      logConfig: {
        fieldLogLevel: appsync.FieldLogLevel.ERROR,
        role: cloudWatchLogsRole,
      },
    });

    const workshopTableDataSource = api.addDynamoDbDataSource('WorkshopTableDataSource', workshopsTable);
    const userDataSource = api.addNoneDataSource('UserDataSource');

    userDataSource.createResolver({
      typeName: 'Query',
      fieldName: 'me',
      requestMappingTemplate: appsync.MappingTemplate.fromString(mappingTemplates.queryMe.request),
      responseMappingTemplate: appsync.MappingTemplate.fromString(mappingTemplates.queryMe.response),
    });

    const isAdminFunction = new appsync.AppsyncFunction(this, 'IsAdminFunction', {
      name: 'isAdminFunction',
      api,
      dataSource: userDataSource,
      requestMappingTemplate: appsync.MappingTemplate.fromString(mappingTemplates.functionIsAdmin.request),
      responseMappingTemplate: appsync.MappingTemplate.fromString(mappingTemplates.functionIsAdmin.response),
    });

    const storeWorkshopFunction = new appsync.AppsyncFunction(this, 'StoreWorkshopFunction', {
      name: 'storeWorkshopFunction',
      api,
      dataSource: workshopTableDataSource,
      requestMappingTemplate: appsync.MappingTemplate.fromString(mappingTemplates.functionStoreWorkshop.request),
      responseMappingTemplate: appsync.MappingTemplate.fromString(mappingTemplates.functionStoreWorkshop.response),
    });

    const updateWorkshopFunction = new appsync.AppsyncFunction(this, 'UpdateWorkshopFunction', {
      name: 'updateWorkshopFunction',
      api,
      dataSource: workshopTableDataSource,
      requestMappingTemplate: appsync.MappingTemplate.fromString(mappingTemplates.functionUpdateWorkshop.request),
      responseMappingTemplate: appsync.MappingTemplate.fromString(mappingTemplates.functionUpdateWorkshop.response),
    });

    const createClerkUsersDataSource = api.addLambdaDataSource(
      'CreateClerkUsersDataSource',
      new lambdaNodejs.NodejsFunction(this, 'CreateClerkUsersFunction', {
        entry: join(__dirname, '../functions/create-clerk-users.ts'),
        environment: {
          CLERK_API_KEY: clerkApiKey.secretValue.toString(),
        },
      }),
    );
    const createClerkUsersFunction = createClerkUsersDataSource.createFunction({
      name: 'createClerkUsersFunction',
      requestMappingTemplate: appsync.MappingTemplate.fromString(mappingTemplates.functionCreateClerkUsers.request),
      responseMappingTemplate: appsync.MappingTemplate.fromString(mappingTemplates.functionCreateClerkUsers.response),
    });

    new appsync.Resolver(this, 'CreateWorkshopPipelineResolver', {
      api,
      typeName: 'Mutation',
      fieldName: 'createWorkshop',
      pipelineConfig: [isAdminFunction, storeWorkshopFunction, createClerkUsersFunction],
      requestMappingTemplate: appsync.MappingTemplate.fromString(mappingTemplates.mutationCreateWorkshop.request),
      responseMappingTemplate: appsync.MappingTemplate.fromString(mappingTemplates.mutationCreateWorkshop.response),
    });

    new appsync.Resolver(this, 'UpdateWorkshopPipelineResolver', {
      api,
      typeName: 'Mutation',
      fieldName: 'updateWorkshop',
      pipelineConfig: [isAdminFunction, updateWorkshopFunction, createClerkUsersFunction],
      requestMappingTemplate: appsync.MappingTemplate.fromString(mappingTemplates.mutationUpdateWorkshop.request),
      responseMappingTemplate: appsync.MappingTemplate.fromString(mappingTemplates.mutationUpdateWorkshop.response),
    });

    workshopTableDataSource.createResolver({
      typeName: 'Query',
      fieldName: 'workshops',
      requestMappingTemplate: appsync.MappingTemplate.fromString(mappingTemplates.queryWorkshops.request),
      responseMappingTemplate: appsync.MappingTemplate.fromString(mappingTemplates.queryWorkshops.response),
    });

    const awsSignInUrlFunction = new lambdaNodejs.NodejsFunction(this, 'AwsSignInUrlFunction', {
      entry: join(__dirname, '../functions/aws-sign-in-url.ts'),
      environment: {
        WORKSHOP_ATTENDEE_ROLE_NAME: props.workshopAttendeeRoleName,
        SIGN_IN_USER_ACCESS_KEY_ID: awsSignInUrlUserAccessKey.accessKeyId,
        SIGN_IN_USER_SECRET_ACCESS_KEY: awsSignInUrlUserAccessKey.secretAccessKey.toString(),
      },
    });

    const awsSignInUrlDataSource = api.addLambdaDataSource('AwsSignInUrlDataSource', awsSignInUrlFunction);
    awsSignInUrlDataSource.createResolver({
      typeName: 'Mutation',
      fieldName: 'createAwsSignInUrl',
    });

    new CfnOutput(this, 'Endpoint', {
      value: api.graphqlUrl,
    });
  }
}
