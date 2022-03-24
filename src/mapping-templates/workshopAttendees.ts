export const request = `
  {
    "version" : "2017-02-28",
    "operation" : "Query",
    "query": {
      "expression": "workshopId = :workshopId and begins_with(node, :node)",
      "expressionValues" : {
        ":workshopId": {
          "S" : "$ctx.source.id"
        },
        ":node": {
          "S": "attendee#"
        }
      }
    }
  }
`;

export const response = `
  #set($attendees = [])
  #foreach($attendee in $ctx.result.items)
    $util.qr($attendees.add($util.str.toReplace($attendee.node, "attendee#", "")))
  #end
  $util.toJson($attendees)
`;
