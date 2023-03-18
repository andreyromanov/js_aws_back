import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, TransactWriteCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from 'uuid';
import { validateObject } from "./productSchema";

export const createProduct = async (event) => {
  console.log(`POST - createProducts, data: ${event.body}`);
  let body;
  if(typeof event.body === 'string') {
    body = JSON.parse(event.body)
  } else {
    body = event.body    
  }
  
  try {
    const validate = validateObject(body);
    if (validate.error) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'text/plain' },
        body: validate.error.message,
      }
    }
    const dynamoDbClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));
    const { title, description, price, count } = body;
    const id = uuidv4();

    await dynamoDbClient.send(new TransactWriteCommand({
      TransactItems: [
        {
          Put: {
            Item: {
              id,
              title,
              description,
              price
            },
            TableName: "products-table-dev",
          },
        },
        {
          Put: {
            Item: {
              product_id: id,
              count
            },
            TableName: "stocks-table-dev",
          },
        },
      ],
    }));

    return {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      statusCode: 201,
      body: JSON.stringify({ id, title, description, price, count }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'text/plain' },
      body: error.message,
    }
  }
};