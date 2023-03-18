import { S3 } from "@aws-sdk/client-s3";
import { Readable } from 'stream'
import csv from 'csv-parser';

export const importFileParser = async (event) => {
  const client = new S3({ region: 'eu-west-2' });
  const stream = new Readable();
  const params = {
    Bucket: 'import-service-bucket-aws-js',
    Key: `${event.Records[0].s3.object.key}`
  };
  const getObjectResult = await client.getObject(params);
  const bodyStream = await getObjectResult.Body.transformToString();
  stream.push(bodyStream);
  stream.push(null);
  await new Promise(() => {
    stream.pipe(csv())
    .on('data', (data) => {
      console.log('DATA', data);
    })
    .on('end', async () => {
      const putParams = {
        Bucket: 'import-service-bucket-aws-js',
        Key: event.Records[0].s3.object.key.replace('uploaded', 'parsed'),
        Body: bodyStream,
        ContentType: 'text/csv'
      };
      await client.putObject(putParams);
      await client.deleteObject(params);
    });
  });
};