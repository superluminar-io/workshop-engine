import * as servicecatalog from '@aws-cdk/aws-servicecatalog-alpha';
import { Aws, aws_cloudformation as cfn } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { TargetAccountBaselineStackSet } from '../stack-sets/target-account-baseline-stack-set';

export interface WorkshopAccountBaselineProps {
  ou: string;
  workshopAttendeeRoleName: string;
  stackSetName: string;
}

export class WorkshopAccountBaseline extends Construct {
  constructor(scope: Construct, id: string, props: WorkshopAccountBaselineProps) {
    super(scope, id);

    const targetAccountBaselineStackSet = new TargetAccountBaselineStackSet(this, 'TargetAccountBaselineStackSetTemplate');

    new cfn.CfnStackSet(this, 'TargetAccountBaselineStackSet', {
      autoDeployment: {
        enabled: true,
        retainStacksOnAccountRemoval: false,
      },
      capabilities: ['CAPABILITY_IAM', 'CAPABILITY_NAMED_IAM'],
      permissionModel: 'SERVICE_MANAGED',
      stackSetName: props.stackSetName,
      callAs: 'DELEGATED_ADMIN',
      parameters: [
        {
          parameterKey: 'workshopAttendeeRoleName',
          parameterValue: props.workshopAttendeeRoleName,
        },
      ],
      stackInstancesGroup: [
        {
          deploymentTargets: {
            organizationalUnitIds: [
              props.ou,
            ],
          },
          regions: [Aws.REGION],
        },
      ],
      templateUrl: servicecatalog.CloudFormationTemplate.fromProductStack(targetAccountBaselineStackSet).bind(this).httpUrl,
    });
  }
}
