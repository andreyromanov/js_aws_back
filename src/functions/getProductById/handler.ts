import type { APIGatewayProxyEvent } from "aws-lambda"
import { formatJSONResponse, formatJSONError } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { getProducts } from '@libs/mocks/products';

const getProductById = async (event: APIGatewayProxyEvent) => {
  const { productId } = event.pathParameters;
  const products = await getProducts.then(data => data);
  const product = products.find(p => p.id === productId);

  if (!product) {
    return formatJSONError({ message: 'Product not found!' }, 404);
  }

  return formatJSONResponse(product);
};

export const main = middyfy(getProductById);
