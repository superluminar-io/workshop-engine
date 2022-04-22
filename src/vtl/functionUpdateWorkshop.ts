export const request = `
  {
    "version" : "2017-02-28",
    "operation" : "UpdateItem",
    "key" : {
      "id": $util.dynamodb.toDynamoDBJson($ctx.args.workshopId),
    },
    "update": {
      "expression" : "SET title = :title, awsAccountId = :awsAccountId, attendees = :attendees",
      "expressionValues": {
        ":title" : $util.dynamodb.toDynamoDBJson($ctx.args.input.title),
        ":awsAccountId" : $util.dynamodb.toDynamoDBJson("$util.defaultIfNullOrEmpty($ctx.args.input.awsAccountId, '')"),
        ":attendees" : $util.dynamodb.toDynamoDBJson($ctx.args.input.attendees)
      }
    }
  }
`;

export const response = `
  $util.toJson($ctx.result)
`;
