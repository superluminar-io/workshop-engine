import { App } from 'aws-cdk-lib';
import { AwsAccount, OrganizationalUnit } from './config';
import { WorkshopEngineStack } from './stacks/workshop-engine-stack';

const app = new App();

new WorkshopEngineStack(app, 'workshop-engine-prod', {
  env: {
    account: AwsAccount['workshop-engine-prod'],
    region: 'eu-west-1',
  },
  ou: OrganizationalUnit['Workshop Accounts'],
});

app.synth();
