export const request = `
  {
    "version": "2018-05-29",
    "operation": "Invoke",
    "payload": {
      "userEmailAddresses": $util.toJson($ctx.arguments.input.attendees)
    }
  }
`;

export const response = `
  $util.toJson($ctx.prev.result)
`;
