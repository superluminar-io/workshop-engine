import * as servicecatalog from '@aws-cdk/aws-servicecatalog-alpha';
import { Construct } from 'constructs';
import { Owner } from '../config';
import { PortfolioShare } from '../constructs/portfolio-share';
import { HelloWorldProduct } from '../products/hello-world-product';

export interface PortfolioProps {
  ou: string;
}

export class Portfolio extends Construct {
  constructor(scope: Construct, id: string, props: PortfolioProps) {
    super(scope, id);

    const portfolio = new servicecatalog.Portfolio(this, 'Portfolio', {
      displayName: 'WorkshopPortfolio',
      providerName: Owner.superluminar,
    });


    new PortfolioShare(this, 'PortfolioShare', {
      ou: props.ou,
      portfolioId: portfolio.portfolioId,
    });

    const helloWorldProduct = new servicecatalog.CloudFormationProduct(this, 'HelloWorldProduct', {
      productName: 'HelloWorld',
      owner: Owner.superluminar,
      productVersions: [
        {
          productVersionName: 'v1',
          cloudFormationTemplate: servicecatalog.CloudFormationTemplate.fromProductStack(new HelloWorldProduct(this, 'HelloWorld')),
        },
      ],
    });
    portfolio.addProduct(helloWorldProduct);
  }
}
