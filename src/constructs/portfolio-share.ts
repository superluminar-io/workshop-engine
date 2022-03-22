import { custom_resources as cr, aws_iam as iam } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export interface PortfolioShareProps {
  ou: string;
  portfolioId: string;
}

export class PortfolioShare extends Construct {
  constructor(scope: Construct, id: string, props: PortfolioShareProps) {
    super(scope, id);

    new cr.AwsCustomResource(this, `${id}CustomResource`, {
      onCreate: {
        service: 'ServiceCatalog',
        action: 'createPortfolioShare',
        parameters: {
          PortfolioId: props.portfolioId,
          OrganizationNode: {
            Type: 'ORGANIZATIONAL_UNIT',
            Value: props.ou,
          },
        },
        physicalResourceId: cr.PhysicalResourceId.of(`portfolioShare${props.portfolioId}${props.ou}`),
      },
      onUpdate: {
        service: 'ServiceCatalog',
        action: 'updatePortfolioShare',
        parameters: {
          PortfolioId: props.portfolioId,
          OrganizationNode: {
            Type: 'ORGANIZATIONAL_UNIT',
            Value: props.ou,
          },
        },
        physicalResourceId: cr.PhysicalResourceId.of(`portfolioShare${props.portfolioId}${props.ou}`),
      },
      onDelete: {
        service: 'ServiceCatalog',
        action: 'deletePortfolioShare',
        parameters: {
          PortfolioId: props.portfolioId,
          OrganizationNode: {
            Type: 'ORGANIZATIONAL_UNIT',
            Value: props.ou,
          },
        },
        physicalResourceId: cr.PhysicalResourceId.of(`portfolioShare${props.portfolioId}${props.ou}`),
      },
      policy: cr.AwsCustomResourcePolicy.fromStatements([
        new iam.PolicyStatement({
          actions: [
            '*',
          ],
          resources: [
            '*',
          ],
        }),
      ]),
    });
  }
}
