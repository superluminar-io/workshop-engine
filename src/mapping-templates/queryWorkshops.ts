export const request = `
  #if( $ctx.identity.resolverContext.role == 'ADMIN' )
    {
      "version": "2017-02-28",
      "operation": "Query",
      "query": {
        "expression": "node = :node",
        "expressionValues": {
          ":node": {
            "S" : "workshop"
          }
        },
      },
      "index": "byNode",
      "limit": $util.defaultIfNull($ctx.args.limit, 20),
      "nextToken": $util.toJson($util.defaultIfNullOrBlank($ctx.args.nextToken, null))
    }
  #else
    {
      "version": "2017-02-28",
      "operation": "Query",
      "query": {
        "expression": "node = :node",
        "expressionValues": {
          ":node": {
            "S" : "workshop"
          }
        },
      },
      "filter": {
        "expression": "contains(#attendees, :attendee)",
        "expressionNames": {
          "#attendees": "attendees",
        },
        "expressionValues": {
          ":attendee": {
            "S": "$ctx.identity.resolverContext.emailAddress"
          }
        }
      },
      "index": "byNode",
      "limit": $util.defaultIfNull($ctx.args.limit, 20),
      "nextToken": $util.toJson($util.defaultIfNullOrBlank($ctx.args.nextToken, null))
    }
  #end
`;

export const response = `
  {
    "items": $util.toJson($ctx.result.items),
    "nextToken": $util.toJson($util.defaultIfNullOrBlank($context.result.nextToken, null))
  }
`;
