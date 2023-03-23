export const basicAuthorizer = async (event) => {
  try {
    const authorizationHeader = event.authorizationToken;
    const encodedCreds = authorizationHeader.split(' ')[1];
    const plainCreds = (new Buffer(encodedCreds, 'base64')).toString().split(':');
    const login = plainCreds[0];
    const password = plainCreds[1];

    if (!(login === process.env.LOGIN && password === process.env.PASSWORD)) {
      return generateResponse(login, event.methodArn, 'Deny');
    }

    return generateResponse(login, event.methodArn, 'Allow');
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'text/plain' },
      body: error.message,
    }
  }
};

const generateResponse = (principalId: string, resource: string, Effect: string) => {
  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect,
          Resource: [resource]
        }
      ]
    }
  }
}
