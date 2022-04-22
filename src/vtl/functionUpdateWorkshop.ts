export const request = `
  {
    "version" : "2017-02-28",
    "operation" : "UpdateItem",
    "key" : {
      "id": $util.dynamodb.toDynamoDBJson($ctx.arguments.workshopId)
    },
    "update": {
      "expression" : "SET title = :title, awsAccountId = :awsAccountId, attendees = :attendees",
      "expressionValues": {
        ":title" : $util.dynamodb.toDynamoDBJson($ctx.arguments.input.title),
        ":awsAccountId" : $util.dynamodb.toDynamoDBJson("$util.defaultIfNullOrEmpty($ctx.arguments.input.awsAccountId, '')"),
        ":attendees" : $util.dynamodb.toDynamoDBJson($ctx.arguments.input.attendees)
      }
    }
  }
`;

export const response = `
  $util.toJson($ctx.result)
`;
