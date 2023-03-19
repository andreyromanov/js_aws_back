import { catalogBatchProcess } from '../src/catalogBatchProcess';
import { Lambda as LambdaMock } from 'aws-sdk';

jest.mock('aws-sdk', () => {
  const mLambda = { invoke: jest.fn() };
  return { Lambda: jest.fn(() => mLambda) };
});

describe('Process batch of items', () => {
  test('should successfuly invoke lambda', async () => {
    const event = {
      Records: [
        {
          body: JSON.stringify({}),
        }
      ]
    };
    const mLambda = new LambdaMock();
    const mResult = {};
    (mLambda.invoke as jest.Mocked<any>).mockImplementationOnce((_params, callback) => {
      callback(null, mResult);
    });
    const actual = await catalogBatchProcess(event);
    expect(actual).toEqual(JSON.stringify({}));
    expect(LambdaMock).toBeCalledWith({ region: 'eu-west-2', endpoint: undefined });
    expect(mLambda.invoke).toBeCalledWith(
      {
        FunctionName: undefined,
        Payload: JSON.stringify({ body: JSON.parse(event.Records[0].body) })
      },
      expect.any(Function),
    );
  });

  test('should return error after lambda invokation', async () => {
    const event = {
      Records: [
        {
          body: JSON.stringify({}),
        }
      ]
    };
    const mLambda = new LambdaMock();
    const mResult = {};
    (mLambda.invoke as jest.Mocked<any>).mockImplementationOnce((_params, callback) => {
      callback({ error: 'error' }, mResult);
    });

    try {
      await catalogBatchProcess(event);
    } catch (error) {
      expect(LambdaMock).toBeCalledWith({ region: 'eu-west-2', endpoint: undefined });
      expect(mLambda.invoke).toBeCalledWith(
        {
          FunctionName: undefined,
          Payload: JSON.stringify({ body: JSON.parse(event.Records[0].body) })
        },
        expect.any(Function),
      );
    }


  });
});