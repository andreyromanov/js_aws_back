import { getProducts } from './products';

export const getProductsById = async (event) => {
    const { productId } = event.pathParameters;
    const products = await getProducts.then(data => data);
    const product = products.find(p => p.id === productId);

    if (!product) {
        return {
            statusCode: 404,
            headers: { 'Content-Type': 'text/plain' },
            body: 'Product not found.',
        }
    }

    return {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
        statusCode: 200,
        body: JSON.stringify(product),
    };
};