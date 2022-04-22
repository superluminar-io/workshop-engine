export const request = `
  {
    "version": "2018-05-29",
    "payload": {
      "emailAddress": "$ctx.identity.resolverContext.emailAddress",
      "role": "$ctx.identity.resolverContext.role"
    }
  }
`;

export const response = `
  $util.toJson($context.result)
`;
