import { rejects } from 'assert';
import AWS from 'aws-sdk'
import { resolve } from 'path';

const lambda = new AWS.Lambda({
  region: 'eu-west-2'
});

export const catalogBatchProcess = async (event) => {
  return await new Promise(async () => {
    console.log(`SQS - catalogBatchProcess`);
    const payload = JSON.stringify({body: JSON.parse(event.Records[0].body)})
    const params = {
      FunctionName: process.env.CREATE_PRODUCTS_LAMBDA,
      Payload: payload,
    };
    lambda.invoke(params, (err, data) => {
      if (err) {
        console.log(err);
      }
      console.log(data);
      resolve(JSON.stringify(data))
    });
  });
};