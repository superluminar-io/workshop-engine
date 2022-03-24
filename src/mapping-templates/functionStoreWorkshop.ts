export const request = (tableName: string): string => `
  #set($ctx.stash = {})
  $util.qr($ctx.stash.put("workshopId", $util.autoId()))
  $util.qr($ctx.stash.put("createdAt", $util.time.nowISO8601()))

  #set($entities = [])
  $util.qr($entities.add($util.dynamodb.toMap({ "workshopId": "$ctx.stash.workshopId", "node": "workshop", "title": "$ctx.arguments.input.title", "awsAccountId": "$ctx.arguments.input.awsAccountId", "createdAt": "$ctx.stash.createdAt" }).M))
  #foreach($attendee in $ctx.arguments.input.attendees)
    $util.qr($entities.add($util.dynamodb.toMap({ "workshopId": "$ctx.stash.workshopId", "node": "attendee#$attendee", "awsAccountId": "$ctx.arguments.input.awsAccountId", "createdAt": "$ctx.stash.createdAt" }).M))
  #end
  {
    "version" : "2018-05-29",
    "operation" : "BatchPutItem",
    "tables" : {
      "${tableName}": $utils.toJson($entities)
    }
  }
`;

export const response = `
  {
    "id": "$ctx.stash.workshopId",
    "title": "$ctx.arguments.input.title",
    "createdAt": "$ctx.stash.createdAt",
    "awsAccountId": "$ctx.arguments.input.awsAccountId",
  }
`;
