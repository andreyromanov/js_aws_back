import AWS from 'aws-sdk'

const lambda = new AWS.Lambda({
  region: 'eu-west-2'
});
const SNS = new AWS.SNS();

export const catalogBatchProcess = async (event): Promise<string> => {
  return new Promise((resolve, reject) => {
    console.log(`SQS - catalogBatchProcess`);
    event.Records.forEach(record => {
      const parsedBody = JSON.parse(record.body)
      const payload = JSON.stringify({ body: parsedBody })

      const params = {
        FunctionName: process.env.CREATE_PRODUCTS_LAMBDA,
        Payload: payload,
      };
      lambda.invoke(params, (err) => {
        if (err) {
          reject(err);
          return;
        }
        SNS.publish({
          Subject: 'Product created!',
          Message: 'New product is created',
          MessageAttributes: {
            title: {
              DataType: 'String',
              StringValue: parsedBody.title,
            },
          },
          TopicArn: process.env.SNS_ARN
        }, (err) => {
          if (err) {
            console.log('Error', err);
          }
        });
      });
    });
  });
};