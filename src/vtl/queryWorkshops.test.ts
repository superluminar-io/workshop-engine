import Parser from 'appsync-template-tester';
import { request, response } from './queryWorkshops';

describe('request mapping', () => {
  describe('user has admin role', () => {
    it('should match snapshot', () => {
      const parser = new Parser(request);

      const context = {
        identity: {
          resolverContext: {
            emailAddress: 'me@example.com',
            role: 'ADMIN',
          },
        },
      };

      expect(parser.resolve(context)).toMatchSnapshot();
    });
  });

  describe('user has not admin role', () => {
    it('should match snapshot', () => {
      const parser = new Parser(request);

      const context = {
        identity: {
          resolverContext: {
            emailAddress: 'me@example.com',
            role: 'ATTENDEE',
          },
        },
      };

      expect(parser.resolve(context)).toMatchSnapshot();
    });
  });
});

describe('response mapping', () => {
  describe('result w/ next token', () => {
    it('should match snapshot', () => {
      const parser = new Parser(response);

      const context = {
        result: {
          items: [
            {
              any: 'data',
            },
            {
              any: 'data',
            },
          ],
          nextToken: 'abc',
        },
      };

      expect(parser.resolve(context)).toMatchSnapshot();
    });
  });

  describe('result w/o next token', () => {
    it('should match snapshot', () => {
      const parser = new Parser(response);

      const context = {
        result: {
          items: [
            {
              any: 'data',
            },
            {
              any: 'data',
            },
          ],
        },
      };

      expect(parser.resolve(context)).toMatchSnapshot();
    });
  });
});
