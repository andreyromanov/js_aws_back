import AWS from 'aws-sdk'

const lambda = new AWS.Lambda({
  region: 'eu-west-2'
});
const SNS = new AWS.SNS();

export const catalogBatchProcess = async (event): Promise<string> => {
  return new Promise((resolve, reject) => {
    console.log(`SQS - catalogBatchProcess`);
    const payload = JSON.stringify({body: JSON.parse(event.Records[0].body)})
    const params = {
      FunctionName: process.env.CREATE_PRODUCTS_LAMBDA,
      Payload: payload,
    };
    lambda.invoke(params, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      SNS.publish({
        Subject: 'Sns email',
        Message: 'Hello world',
        TopicArn: process.env.SNS_ARN
      }, () => {
        console.log('Sent mesage to topic');
      });
      resolve(JSON.stringify(data));
    });
    
  });
};