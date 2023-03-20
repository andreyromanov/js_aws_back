import { catalogBatchProcess } from '../src/catalogBatchProcess';
import { Lambda as LambdaMock, SNS as SNSMock } from 'aws-sdk';

jest.mock('aws-sdk', () => {
  const mLambda = { invoke: jest.fn() };
  const mSns = { publish: jest.fn() };
  return {
    Lambda: jest.fn(() => mLambda),
    SNS: jest.fn(() => mSns)
  };
});

describe('Process batch of items', () => {
  const mLambda = new LambdaMock();
  const mSns = new SNSMock();
  const event = {
    Records: [
      {
        body: JSON.stringify({}),
      }
    ]
  };

  beforeEach(() => {
    (mSns.publish as jest.Mocked<any>).mockImplementationOnce((_params, callback) => {
      callback(null, {});
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });


  test('should successfuly invoke lambda', async () => {
    (mLambda.invoke as jest.Mocked<any>).mockImplementationOnce((_params, callback) => {
      callback(null, {});
    });

    const res = await catalogBatchProcess(event);

    expect(res).toEqual(JSON.stringify({}));
    expect(mLambda.invoke).toBeCalledWith(
      {
        FunctionName: undefined,
        Payload: JSON.stringify({ body: JSON.parse(event.Records[0].body) })
      },
      expect.any(Function),
    );
    expect(mSns.publish).toBeCalled()
  });

  test('should return error after lambda invokation', async () => {
    (mLambda.invoke as jest.Mocked<any>).mockImplementationOnce((_params, callback) => {
      callback({ error: 'error' }, {});
    });

    try {
      await catalogBatchProcess(event);
    } catch (error) {
      expect(mLambda.invoke).toBeCalledWith(
        {
          FunctionName: undefined,
          Payload: JSON.stringify({ body: JSON.parse(event.Records[0].body) })
        },
        expect.any(Function),
      );
      expect(mSns.publish).not.toBeCalled();
    }
  });
});