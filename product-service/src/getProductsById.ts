import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

export const getProductsById = async (event) => {
  try {
    const dynamoDbClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));
    const { productId } = event.pathParameters;

    const products = await dynamoDbClient.send(new GetCommand({ 
      TableName: 'products-table-dev',
      Key: {
        id: productId
      },
    }));
    const stocks = await dynamoDbClient.send(new GetCommand({ 
      TableName: 'stocks-table-dev',
      Key: {
        product_id: productId
      },
    }));

    if (!products.Item && !stocks.Item) {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Product not found.',
      }
    }

    const {count} = stocks.Item;    
    const joinedProduct = {
      ...products.Item,
      count
    };

    return {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      statusCode: 200,
      body: JSON.stringify(joinedProduct),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'text/plain' },
      body: error.message,
    }
  }
};