export const request = `
  {
    "version" : "2018-05-29",
    "operation" : "DeleteItem",
    "key": {
      "id": $util.dynamodb.toDynamoDBJson($ctx.arguments.workshopId)
    }
  }
`;

export const response = `
  $util.toJson($ctx.result)
`;
