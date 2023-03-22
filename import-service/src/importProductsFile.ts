import AWS from 'aws-sdk';

export const importProductsFile = async (event) => {
  try {
    const s3 = new AWS.S3({ region: 'eu-west-2' });
    const csvFile = event.queryStringParameters?.name;
    const BUCKET = 'import-service-bucket-aws-js';
    const catalogName = `uploaded/${csvFile}`;
    const params = {
        Bucket: BUCKET,
        Key: catalogName,
        ContentType: 'text/csv'
    }
    const signedUrl = s3.getSignedUrl('putObject', params);
    return {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      statusCode: 200,
      body: JSON.stringify(signedUrl),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'text/plain' },
      body: error.message,
    }
  }
};