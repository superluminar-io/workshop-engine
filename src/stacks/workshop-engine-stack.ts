import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { workshopAttendeeRoleName } from '../config';
import { GraphQLApi } from '../constructs/graphql-api';
import { Portfolio } from '../constructs/portfolio';
import { WorkshopAccountBaseline } from '../constructs/workshop-account-baseline';

export interface WorkshopEngineStackProps extends StackProps {
  ou: string;
  portfolioName: string;
  workshopBaselineStackSetName: string;
}

export class WorkshopEngineStack extends Stack {
  constructor(scope: Construct, id: string, props: WorkshopEngineStackProps) {
    super(scope, id, props);

    new Portfolio(this, 'WorkshopPortfolio', {
      ou: props.ou,
      portfolioName: props.portfolioName,
    });

    new WorkshopAccountBaseline(this, 'WorkshopAccountBaseline', {
      ou: props.ou,
      workshopAttendeeRoleName,
      stackSetName: props.workshopBaselineStackSetName,
    });

    new GraphQLApi(this, 'GraphQLApi', {
      workshopAttendeeRoleName,
    });
  }
}
