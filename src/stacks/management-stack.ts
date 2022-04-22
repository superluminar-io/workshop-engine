
import { Stack, StackProps, aws_iam as iam } from 'aws-cdk-lib';
import { AWSManagedPolicies } from 'cdk-common';
import { Construct } from 'constructs';

export class ManagementStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const ciUser = new iam.User(this, 'CiUser');
    ciUser.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName(AWSManagedPolicies.ADMINISTRATOR_ACCESS),
    );
  }
}
