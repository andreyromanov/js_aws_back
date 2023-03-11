import { S3 } from "aws-sdk";
import { Readable } from 'stream'
import csv from 'csv-parser';

export const importFileParser = async (event) => {
  const client = new S3({ region: 'eu-west-2', httpOptions: { timeout: 3000 } });
  const stream = new Readable();
  const params = {
    Bucket: 'import-service-bucket-aws-js',
    Key: `${event.Records[0].s3.object.key}`
  };
  const data = (await (client.getObject(params).promise())).Body.toString('utf-8')
  stream.push(data);
  stream.push(null);
  stream.pipe(csv())
    .on('data', (data) => {
      console.log('DATA', data);
    })
    .on('end', async () => {
      var params = {
        Bucket: 'import-service-bucket-aws-js',
        CopySource: encodeURI(`import-service-bucket-aws-js/${event.Records[0].s3.object.key}`),
        Key: event.Records[0].s3.object.key.replace('uploaded', 'parsed')
      };
      await client.copyObject(params).promise()
    });
};