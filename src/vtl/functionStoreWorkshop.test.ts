import Parser from 'appsync-template-tester';
import { request, response } from './functionStoreWorkshop';

jest.mock('uuid', () => ({ v4: () => 'beb79a10-437e-48df-96e2-9cd87fdc063f' }));
jest.mock('moment-timezone', () => ({ utc: () => new Date('2022-04-22T19:38:10.703Z') }));

describe('request mapping', () => {
  describe('input w/ aws account id', () => {
    it('should match snapshot', () => {
      const parser = new Parser(request);

      const input = {
        title: 'Serverless Beginner Workshop',
        awsAccountId: '298097285261',
        attendees: [
          'me@xample.com',
          'you@xample.com',
        ],
      };

      const context = {
        arguments: {
          input,
        },
      };

      expect(parser.resolve(context)).toMatchSnapshot();
    });
  });

  describe('input w/o aws account id', () => {
    it('should match snapshot', () => {
      const parser = new Parser(request);

      const input = {
        title: 'Serverless Beginner Workshop',
        attendees: [
          'me@xample.com',
          'you@xample.com',
        ],
      };

      const context = {
        arguments: {
          input,
        },
      };

      expect(parser.resolve(context)).toMatchSnapshot();
    });
  });
});

describe('response mapping', () => {
  it('should match snapshot', () => {
    const parser = new Parser(response);

    const context = {
      result: {
        any: 'data',
      },
    };

    expect(parser.resolve(context)).toMatchSnapshot();
  });
});
