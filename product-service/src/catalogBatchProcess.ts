import AWS from 'aws-sdk'

const lambda = new AWS.Lambda({
  region: 'eu-west-2'
});
const SNS = new AWS.SNS();

export const catalogBatchProcess = async (event): Promise<string> => {
  return new Promise((resolve, reject) => {
    console.log(`SQS - catalogBatchProcess`);
    const parsedBody = JSON.parse(event.Records[0].body)
    const payload = JSON.stringify({body: parsedBody})
    console.log('STRING BODY', payload);
    
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
        Subject: 'Product created!',
        Message: 'New product is created',
        MessageAttributes: {
          title: {
            DataType: 'String',
            StringValue: parsedBody.title,
          },
        },
        TopicArn: process.env.SNS_ARN
      }, (err, data) => {
        if(err){
          console.log('Error', err);
        }
        console.log('Sent mesage to topic', data);
      });
      resolve(JSON.stringify(data));
    });
    
  });
};