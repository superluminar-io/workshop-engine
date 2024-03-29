const { awscdk } = require('projen');
const project = new awscdk.AwsCdkTypeScriptApp({
  cdkVersion: '2.1.0',
  defaultReleaseBranch: 'main',
  name: 'workshop-engine',
  license: 'MIT',
  copyrightOwner: 'superluminar GmbH',
  autoApproveOptions: {
    allowedUsernames: ['superluminar-bot'],
  },
  depsUpgradeOptions: {
    workflowOptions: {
      labels: ['auto-approve'],
    },
  },
  deps: [
    '@aws-cdk/aws-servicecatalog-alpha',
    '@aws-cdk/aws-appsync-alpha',
    'cdk-common',
    '@aws-sdk/client-sts',
    'node-fetch@2',
    '@clerk/clerk-sdk-node',
    'appsync-template-tester',
  ],
  devDeps: [
    '@types/node-fetch@2',
    '@types/aws-lambda',
  ],
});
project.synth();
