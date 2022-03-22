import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Portfolio } from '../constructs/portfolio';
import { WorkshopAccountBaseline } from '../constructs/workshop-account-baseline';

export interface WorkshopEngineStackProps extends StackProps {
  ou: string;
}

export class WorkshopEngineStack extends Stack {
  constructor(scope: Construct, id: string, props: WorkshopEngineStackProps) {
    super(scope, id, props);

    new Portfolio(this, 'WorkshopPortfolio', {
      ou: props.ou,
    });

    new WorkshopAccountBaseline(this, 'WorkshopAccountBaseline', {
      ou: props.ou,
    });
  }
}
