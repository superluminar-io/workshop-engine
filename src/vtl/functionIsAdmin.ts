export const request = `
  #if( $ctx.identity.resolverContext.role != 'ADMIN' )
      $util.error("Unauthorized")
  #end
  {
    "version": "2018-05-29",
    "payload": {}
  }
`;

export const response = `
  $util.toJson($context.result)
`;
