import { importProductsFile } from '../src/importProductsFile';

describe('Get signed url', () => {
    test('Should return signed url and status code 200.', async () => {
        const event: any = {
            queryStringParameters: {
                name: "csv.csv"
            }
        };

        const res = await importProductsFile(event);
        const decodedRes = JSON.parse(res.body);

        expect(decodedRes).toBe("uploaded/csv.csv");
        expect(res.statusCode).toBe(200);
    });
});