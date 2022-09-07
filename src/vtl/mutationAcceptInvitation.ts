export const request = `
  $util.qr($ctx.stash.put("clerkUsers", [$ctx.arguments.emailAddress]))
  {}
`;

export const response = `
  {"ok": true}
`;
