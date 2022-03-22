import * as servicecatalog from '@aws-cdk/aws-servicecatalog-alpha';
import { aws_iam as iam } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class HelloWorldProduct extends servicecatalog.ProductStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new iam.User(this, 'HelloWorldUser');
  }
}
