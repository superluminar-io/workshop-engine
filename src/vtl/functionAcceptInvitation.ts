export const request = `
  {
    "version" : "2017-02-28",
    "operation" : "UpdateItem",
    "key" : {
      "id": $util.dynamodb.toDynamoDBJson($ctx.arguments.inviteId)
    },
    "update": {
      "expression" : "SET attendees = list_append(attendees, :attendees)",
      "expressionValues": {
        ":attendees": $util.dynamodb.toDynamoDBJson([$ctx.arguments.emailAddress])
      }
    }
  }
`;

export const response = `
  $util.toJson($ctx.result)
`;
