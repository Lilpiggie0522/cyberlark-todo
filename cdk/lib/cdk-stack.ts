import * as cdk from "aws-cdk-lib"
import { Construct } from "constructs"
import * as apigateway from "aws-cdk-lib/aws-apigateway"
import { Runtime } from "aws-cdk-lib/aws-lambda"
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs"
import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb"

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    // Create a DynamoDB table in provisioned mode with an LSI
    const todoTable = new Table(this, "todo_table", {
      partitionKey: {
        name: "todo_id",
        type: AttributeType.STRING,
      },
      billingMode: BillingMode.PROVISIONED,
      readCapacity: 1,
      writeCapacity: 1,
      tableName: "TodoItems",
    })

    // Add a Local Secondary Index (LSI) with priority as the sort key
    // todoTable.addLocalSecondaryIndex({
    //   indexName: "priorityIndex",
    //   sortKey: { name: "priority", type: AttributeType.STRING },
    //   projectionType: ProjectionType.ALL,
    // })

    // todoTable.addLocalSecondaryIndex({
    //   indexName: "detail",
    //   sortKey: { name: "detail", type: AttributeType.STRING },
    //   projectionType: ProjectionType.ALL,
    // })

    // Lambda function for GET request
    const get_todo_function = new NodejsFunction(this, "get_todo_function", {
      runtime: Runtime.NODEJS_20_X, // Choose any supported Node.js runtime
      entry: "lambda/todo.ts", // Points to the 'todo' file in the lambda directory
      handler: "get_handler", // The exported handler function
      bundling: {
        externalModules: [], // Ensure all modules are bundled
      },
      environment: {
        TABLE_NAME: todoTable.tableName,
      },
    })

    // Lambda function for POST request
    const post_todo_function = new NodejsFunction(this, "post_todo_function", {
      runtime: Runtime.NODEJS_20_X, // Choose any supported Node.js runtime
      entry: "lambda/todo.ts", // Points to the 'todo' file in the lambda directory
      handler: "post_handler", // The exported handler function
      bundling: {
        externalModules: [], // Ensure all modules are bundled
      },
      environment: {
        TABLE_NAME: todoTable.tableName,
      },
    })

    // Lambda function for POST request
    const delete_todo_function = new NodejsFunction(
      this,
      "delete_todo_function",
      {
        runtime: Runtime.NODEJS_20_X, // Choose any supported Node.js runtime
        entry: "lambda/todo.ts", // Points to the 'todo' file in the lambda directory
        handler: "delete_handler", // The exported handler function
        bundling: {
          externalModules: [], // Ensure all modules are bundled
        },
        environment: {
          TABLE_NAME: todoTable.tableName,
        },
      }
    )

    const done_todo_function = new NodejsFunction(this, "done_todo_function", {
      runtime: Runtime.NODEJS_20_X,
      entry: "lambda/todo.ts",
      handler: "done_handler",
      bundling: {
        externalModules: [],
      },
      environment: {
        TABLE_NAME: todoTable.tableName,
      },
    })

    const update_todo_function = new NodejsFunction(
      this,
      "update_todo_function",
      {
        runtime: Runtime.NODEJS_20_X,
        entry: "lambda/todo.ts",
        handler: "update_handler",
        bundling: {
          externalModules: [],
        },
        environment: {
          TABLE_NAME: todoTable.tableName,
        },
      }
    )

    // Grant the Lambda functions read/write permissions on the DynamoDB table
    todoTable.grantReadWriteData(get_todo_function)
    todoTable.grantReadWriteData(post_todo_function)
    todoTable.grantReadWriteData(delete_todo_function)
    todoTable.grantReadWriteData(done_todo_function)
    todoTable.grantReadWriteData(update_todo_function)

    // API Gateway for todo list
    const todo_api = new apigateway.RestApi(this, "todo_api", {
      restApiName: "Todo Service",
    })

    // Define the '/todo' resource with GET and POST methods
    const todo_resource = todo_api.root.addResource("todo")

    todo_resource.addMethod(
      "GET",
      new apigateway.LambdaIntegration(get_todo_function)
    )
    todo_resource.addMethod(
      "POST",
      new apigateway.LambdaIntegration(post_todo_function)
    )
    todo_resource.addMethod(
      "DELETE",
      new apigateway.LambdaIntegration(delete_todo_function)
    )
    const todo_update_status_resource =
      todo_resource.addResource("updateStatus")

    todo_update_status_resource.addMethod(
      "PUT",
      new apigateway.LambdaIntegration(done_todo_function)
    )

    const todo_update_details_resource =
      todo_resource.addResource("updateDetails")

    todo_update_details_resource.addMethod(
      "PUT",
      new apigateway.LambdaIntegration(update_todo_function)
    )
  }
}
