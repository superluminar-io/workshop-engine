export const request = `
  {
    "version" : "2017-02-28",
    "operation" : "PutItem",
    "key": {
      "id": $util.dynamodb.toDynamoDBJson($util.autoId())
    },
    "attributeValues" : $util.dynamodb.toMapValuesJson({
      "node": "workshop",
      "createdAt": "$util.time.nowISO8601()",
      "title": "$ctx.arguments.input.title",
      "description": "$util.defaultIfNullOrEmpty($ctx.arguments.input.description, '')",
      "awsAccountId": "$util.defaultIfNullOrEmpty($ctx.arguments.input.awsAccountId, '')",
      "attendees": $ctx.arguments.input.attendees
    })
  }
`;

export const response = `
  $util.toJson($ctx.result)
`;
