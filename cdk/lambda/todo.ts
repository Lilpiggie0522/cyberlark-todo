import { APIGatewayEvent } from "aws-lambda"
import { v4 as uuid } from "uuid"
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb"

const dbClient = new DynamoDBClient({})
const db = DynamoDBDocumentClient.from(dbClient)

export async function post_handler(event: APIGatewayEvent) {
  console.log("event", event)
  return {
    statusCode: 200,
    body: JSON.stringify(`woo hoo sent from post uuid ${uuid()}!`),
  }
}

export async function get_handler(event: APIGatewayEvent) {
  console.log("event", event)
  const command = new ScanCommand({
    TableName: process.env.TABLE_NAME,
  })
  const response = await db.send(command)
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(response.Items),
  }
}
