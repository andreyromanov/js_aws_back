import { getProductById } from '../src/functions/getProductById/handler';
describe('Get product by id test', () => {
    test('Should return founded product.', async () => {
        const event: any = {
            pathParameters: {
                productId: "7567ec4b-b10c-48c5-9345-fc73c48a80aa"
            }
        };
        const res = await getProductById(event);

        expect(res.statusCode).toBe(200);
    });

    test('Should not find product.', async () => {
        const event: any = {
            pathParameters: {
                productId: 123
            }
        };
        const res = await getProductById(event);

        expect(res.statusCode).toBe(404);
    });
});