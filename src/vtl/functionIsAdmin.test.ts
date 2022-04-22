import Parser from 'appsync-template-tester';
import * as functionIsAdmin from './functionIsAdmin';

describe('request mapping', () => {
  describe('user has admin role', () => {
    it('should match snapshot', () => {
      const parser = new Parser(functionIsAdmin.request);

      const context = {
        identity: {
          resolverContext: {
            role: 'ADMIN',
          },
        },
      };

      expect(parser.resolve(context)).toMatchSnapshot();
    });
  });

  describe('user has not admin role', () => {
    it('should throw an error', () => {
      const parser = new Parser(functionIsAdmin.request);

      const context = {
        identity: {
          resolverContext: {
            role: 'ATTENDEE',
          },
        },
      };

      expect(() => parser.resolve(context)).toThrowError('Unauthorized');
    });
  });
});

describe('response mapping', () => {
  it('should match snapshot', () => {
    const parser = new Parser(functionIsAdmin.response);

    const context = {
      result: {
        any: 'data',
      },
    };

    expect(parser.resolve(context)).toMatchSnapshot();
  });
});
