import { getProducts } from './products';

export const getProductsList = async () => {
  let products = await getProducts.then(data => data)

  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    statusCode: 200,
    body: JSON.stringify(products),
  };
};