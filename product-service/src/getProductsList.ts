import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

export const getProductsList = async () => {
  console.log(`GET - getProductsList`);
  try {
    const dynamoDbClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));
    const products = await dynamoDbClient.send(new ScanCommand({ TableName: 'products-table-dev' }));
    const stocks = await dynamoDbClient.send(new ScanCommand({ TableName: 'stocks-table-dev' }));
    const joinedProducts = [];

    products.Items.forEach((product) => {
      stocks.Items.forEach((stock) => {
        if (product.id === stock.product_id) {
          const { count } = stock;
          joinedProducts.push({
            ...product,
            count
          });
        }
      });
    });

    return {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      statusCode: 200,
      body: JSON.stringify(joinedProducts),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'text/plain' },
      body: error.message,
    }
  }
};