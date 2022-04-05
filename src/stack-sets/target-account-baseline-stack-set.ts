import { ProductStack } from '@aws-cdk/aws-servicecatalog-alpha';
import { Duration, CustomResource, aws_iam as iam, aws_lambda as lambda, aws_servicecatalog as servicecatalog, CfnParameter } from 'aws-cdk-lib';
import { AWSManagedPolicies } from 'cdk-common';
import { Construct } from 'constructs';
import { AwsAccount } from '../config';

export class TargetAccountBaselineStackSet extends ProductStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const workshopAttendeeRoleNameParameter = new CfnParameter(this, 'workshopAttendeeRoleName');

    new iam.Role(this, 'WorkshopAttendee', {
      roleName: workshopAttendeeRoleNameParameter.valueAsString,
      assumedBy: new iam.CompositePrincipal(
        new iam.AccountPrincipal(AwsAccount['workshop-engine-prod']),
        new iam.AccountPrincipal(AwsAccount['workshop-engine-staging']),
        new iam.ServicePrincipal('appsync.amazonaws.com'),
      ),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(AWSManagedPolicies.ADMINISTRATOR_ACCESS),
      ],
    });

    const portfolioPrincipalAssociationLookupsFunction = new lambda.Function(this, 'PortfolioPrincipalAssociationLookupsFunction', {
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_14_X,
      timeout: Duration.minutes(5),
      code: lambda.InlineCode.fromInline(`
        const AWS = require('aws-sdk');
        const response = require('cfn-response');
        
        const servicecatalog = new AWS.ServiceCatalog();
        const iam = new AWS.IAM();
        
        exports.handler = (event, context) => {
          console.log("REQUEST RECEIVED: " + JSON.stringify(event));
          
          if (event.RequestType === 'Delete') {
            response.send(event, context, 'SUCCESS');
            return;
          }
          
          const getPortfolioId = () => new Promise(resolve => {
            servicecatalog.listAcceptedPortfolioShares({
              PortfolioShareType: 'AWS_ORGANIZATIONS',
            }).promise()
            .then(portfolios => {
              if (!portfolios.PortfolioDetails || !portfolios.PortfolioDetails[0]) {
                setTimeout(() => getPortfolioId().then(resolve), 2000);
              } else {
                resolve(portfolios.PortfolioDetails[0].Id)
              }
            })
          })
          
          const getRoleArn = () => new Promise(resolve => {
            iam.listRoles({
              PathPrefix: '/aws-reserved/sso.amazonaws.com/eu-west-1/',
            }).promise()
            .then(roles => {
              const role = roles.Roles.find(r => r.RoleName.startsWith('AWSReservedSSO_AWSAdministratorAccess'));
              if (!role) {
                setTimeout(() => getRoleArn().then(resolve), 2000);
              } else {
                resolve(role.Arn)
              }
            })
          })

          Promise.all([
            getPortfolioId(),
            getRoleArn()
          ])
          .then(([portfolioId, roleArn]) => {
            const responseData = {
              PortfolioId: portfolioId,
              RoleArn: roleArn,
            };
            response.send(event, context, 'SUCCESS', responseData);
          })
          .catch(() => {
            response.send(event, context, 'FAILED');
          });  
        };
      `),
    });
    portfolioPrincipalAssociationLookupsFunction.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['servicecatalog:ListAcceptedPortfolioShares', 'iam:ListRoles'],
        resources: ['*'],
      }),
    );

    const portfolioPrincipalAssociationLookups = new CustomResource(this, 'PortfolioPrincipalAssociationLookups', { serviceToken: portfolioPrincipalAssociationLookupsFunction.functionArn });

    new servicecatalog.CfnPortfolioPrincipalAssociation(this, 'PortfolioPrincipalAssociation', {
      principalType: 'IAM',
      portfolioId: portfolioPrincipalAssociationLookups.getAttString('PortfolioId'),
      principalArn: portfolioPrincipalAssociationLookups.getAttString('RoleArn'),
    });
  }
}
