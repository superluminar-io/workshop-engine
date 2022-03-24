export const request = `
  {
    "version" : "2017-02-28",
    "operation" : "PutItem",
    "key" : {
      "id": $util.dynamodb.toDynamoDBJson($util.autoId()),
    },
    "attributeValues" : $util.dynamodb.toMapValuesJson({
      "node": "workshop",
      "createdAt": "$util.time.nowISO8601()",
      "title": "$ctx.args.input.title",
      "awsAccountId": "$ctx.args.input.awsAccountId",
      "attendees": $ctx.args.input.attendees
    })
  }
`;

export const response = `
  $util.toJson($ctx.result)
`;
