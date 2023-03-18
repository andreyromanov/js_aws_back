import { S3 } from "@aws-sdk/client-s3";
import AWS from 'aws-sdk'
import { Readable } from 'stream'
import csv from 'csv-parser';

export const importFileParser = async (event) => {
  const client = new S3({ region: 'eu-west-2' });
  const SQS = new AWS.SQS();
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
      const params = {
        MessageBody: JSON.stringify(data),
        QueueUrl: process.env.QUEUE_URL
      }
      SQS.sendMessage(params, (err,result) => {
        if (err) {
          console.log(err)
          return
        }
        console.log(`Sent request to create product ${data.id}`)
      })
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