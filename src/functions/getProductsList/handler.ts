import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { getProducts } from '@libs/mocks/products';

const getProductsList = async (event) => {
  let products = await getProducts.then(data => data)

  return formatJSONResponse(products);
};

export const main = middyfy(getProductsList);
