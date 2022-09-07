export const request = `
  $util.qr($ctx.stash.put("clerkUsers", $ctx.arguments.input.attendees))
  {}
`;

export const response = `
  $util.toJson($context.result)
`;
