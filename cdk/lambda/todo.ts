import { APIGatewayEvent } from "aws-lambda"
import { v4 as uuid } from "uuid"

import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb"

const dbClient = new DynamoDBClient({})
const client = DynamoDBDocumentClient.from(dbClient)

export async function get_handler(event: APIGatewayEvent) {
  console.log("get event", event)
  const command = new ScanCommand({
    TableName: process.env.TABLE_NAME,
  })
  const response = await client.send(command)
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(response.Items),
  }
}

export async function post_handler(event: APIGatewayEvent) {
  console.log("post event", event)
  if (event.body) {
    const { detail, due_date, priority, status } = JSON.parse(event.body)
    const newTask = {
      detail: detail,
      due_date: due_date,
      priority: priority,
      todo_id: uuid(),
      status: status,
    }
    const command = new PutCommand({
      TableName: process.env.TABLE_NAME,
      Item: newTask,
    })
    try {
      await client.send(command)
      return {
        statusCode: 200,
        body: JSON.stringify(newTask.todo_id),
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    } catch (error) {
      console.log("Error inserting task: ", error)
      return {
        statusCode: 500,
        body: JSON.stringify(error),
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    }
  }
  return {
    statusCode: 400,
    body: JSON.stringify("empty todo_id"),
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  }
}

export async function done_handler(event: APIGatewayEvent) {
  console.log("update status", event)
  if (event.body) {
    const { todo_id, status }: { todo_id: string; status: boolean } =
      JSON.parse(event.body)
    const command = new UpdateCommand({
      TableName: process.env.TABLE_NAME,
      Key: {
        todo_id: todo_id,
      },
      UpdateExpression: "set #status = :status",
      ExpressionAttributeNames: {
        "#status": "status",
      },
      ExpressionAttributeValues: {
        ":status": !status,
      },
    })
    try {
      await client.send(command)
      return {
        statusCode: 200,
        body: JSON.stringify(!status),
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    } catch (error) {
      console.log(error)
      return {
        statusCode: 500,
        body: JSON.stringify("something wrong with db operation"),
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    }
  }
  return {
    statusCode: 400,
    body: JSON.stringify("empty event.body"),
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  }
}

export async function delete_handler(event: APIGatewayEvent) {
  console.log("delete event", event)
  if (event.body) {
    const { todo_id } = JSON.parse(event.body)
    console.log(`todo_id is ${todo_id}`)
    console.log(`type of todo_id is ${typeof todo_id}`)
    console.log(`table name is ${process.env.TABLE_NAME}`)

    try {
      await client.send(
        new DeleteCommand({
          TableName: process.env.TABLE_NAME,
          Key: {
            todo_id: todo_id,
          },
        })
      )
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(event.body),
      }
    } catch (error) {
      console.log(error)
      return {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify("DB deletion went wrong!"),
      }
    }
  }
  return {
    statusCode: 400,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify("no todo_id"),
  }
}

export async function update_handler(event: APIGatewayEvent) {
  if (event.body) {
    const { due_date, todo_id, priority, detail } = JSON.parse(event.body)
    console.log(`todo_id is ${todo_id}`)
    console.log(`due_date is ${due_date}`)
    console.log(`priority is ${priority}`)
    const command = new UpdateCommand({
      TableName: process.env.TABLE_NAME,
      Key: {
        todo_id: todo_id,
      },
      UpdateExpression:
        "set #due_date = :due_date, #priority = :priority, #detail = :detail",
      ExpressionAttributeNames: {
        "#due_date": "due_date",
        "#priority": "priority",
        "#detail": "detail",
      },
      ExpressionAttributeValues: {
        ":due_date": due_date,
        ":priority": priority,
        ":detail": detail,
      },
    })

    try {
      await client.send(command)
      return {
        statusCode: 200,
        body: JSON.stringify({ todo_id, due_date, priority }),
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    } catch (error) {
      console.log(error)
      return {
        statusCode: 500,
        body: JSON.stringify("Error updating task"),
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    }
  }
  return {
    statusCode: 400,
    body: JSON.stringify("Invalid request"),
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  }
}
