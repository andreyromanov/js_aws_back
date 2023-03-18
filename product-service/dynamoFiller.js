import { DynamoDBClient, BatchExecuteStatementCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from 'uuid';

const region = process.argv[2];
const accessKeyId = process.argv[3];
const secretAccessKey = process.argv[4];

const ddbClient = new DynamoDBClient({
  region, 
  credentials: {
    accessKeyId,
    secretAccessKey
  }
});

const marshallOptions = {
  convertEmptyValues: false,
  removeUndefinedValues: true,
  convertClassInstanceToMap: false
};

const unmarshallOptions = {
  wrapNumbers: false
};

const ddbDocClient = DynamoDBDocumentClient.from(ddbClient, {
  marshallOptions,
  unmarshallOptions,
});

const run = async () => {
  const Statements = [];
  for (let i = 0; i < 10; i++) {
    const id = uuidv4();
    const title = 'title' + i;
    const description = 'description' + i;
    const price = 10 + i;
    const count = 1 + i

    Statements.push(
      {
        Statement:
          "INSERT INTO products value {'id':?, 'title':?, 'description':?, 'price':?}",
          Parameters: [{ S: id }, { S: title }, { S: description }, { N: price.toString() }],
      },
      {
        Statement:
          "INSERT INTO stocks value {'product_id':?, 'count':?}",
        Parameters: [{ S: uuidv4() }, { N: count.toString() }],
      }
    );
  }
  
  const params = { Statements };
  try {
    await ddbDocClient.send(
      new BatchExecuteStatementCommand(params)
    );
    console.log("Success. Items added.");
  } catch (err) {
    console.error(err);
  }
};

run();