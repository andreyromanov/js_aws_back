import { getProductsList } from '../src/functions/getProductsList/handler';

describe('Get list of products test', () => {
    test('Should return array of products and status 200.', async () => {
        const res = await getProductsList();
        const decodedRes = JSON.parse(res.body);

        expect(decodedRes.length).toBeGreaterThan(0);
        expect(res.statusCode).toBe(200);
    });
});