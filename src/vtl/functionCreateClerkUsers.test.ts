import Parser from 'appsync-template-tester';
import * as functionCreateClerkUsers from './functionCreateClerkUsers';

describe('request mapping', () => {
  it('should match snapshot', () => {
    const parser = new Parser(functionCreateClerkUsers.request);

    const context = {
      arguments: {
        input: {
          attendees: [
            'me@example.com',
          ],
        },
      },
    };

    expect(parser.resolve(context)).toMatchSnapshot();
  });
});

describe('response mapping', () => {
  it('should match snapshot', () => {
    const parser = new Parser(functionCreateClerkUsers.response);

    const context = {
      prev: {
        result: {
          any: 'data',
        },
      },
    };

    expect(parser.resolve(context)).toMatchSnapshot();
  });
});
