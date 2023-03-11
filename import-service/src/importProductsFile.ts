export const importProductsFile = async (event) => {
  try {
    const csvFile = event.queryStringParameters?.name;
    const signedUrl = `uploaded/${csvFile}`;
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