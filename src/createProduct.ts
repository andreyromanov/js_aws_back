import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from 'uuid';
import { validateObject } from "./productSchema";

export const createProduct = async (event) => {
  console.log(`POST - createProducts, data: ${event.body}`);
  try {
    const validate = validateObject(JSON.parse(event.body));    
    if(validate.error){
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'text/plain' },
        body: validate.error.message,
      }
    }
    const dynamoDbClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));
    const { title, description, price, count } = JSON.parse(event.body)
    const id = uuidv4();

    const createProduct = dynamoDbClient.send(new PutCommand({
      TableName: 'products-table-dev', Item: { id, title, description, price }
    }));
    const createStock = dynamoDbClient.send(new PutCommand({
      TableName: 'stocks-table-dev', Item: { product_id: id, count }
    }));

    await Promise.all([ createProduct, createStock ]);

    return {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      statusCode: 200,
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