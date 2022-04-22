import Parser from 'appsync-template-tester';
import { request, response } from './functionUpdateWorkshop';

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
          workshopId: 'beb79a10-437e-48df-96e2-9cd87fdc063f',
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
          workshopId: 'beb79a10-437e-48df-96e2-9cd87fdc063f',
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
