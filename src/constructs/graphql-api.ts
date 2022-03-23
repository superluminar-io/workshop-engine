import { join } from 'path';
import * as appsync from '@aws-cdk/aws-appsync-alpha';
import { aws_iam as iam, aws_lambda_nodejs as lambdaNodejs } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export interface GraphQLApiProps {
  workshopAttendeeRoleName: string;
}

export class GraphQLApi extends Construct {
  constructor(scope: Construct, id: string, props: GraphQLApiProps) {
    super(scope, id);

    const api = new appsync.GraphqlApi(this, 'Api', {
      name: 'demo',
      schema: appsync.Schema.fromAsset(join(__dirname, '../../schema.graphql')),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.IAM,
        },
      },
      xrayEnabled: true,
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
