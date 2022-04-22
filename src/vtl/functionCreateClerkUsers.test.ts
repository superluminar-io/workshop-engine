import Parser from 'appsync-template-tester';
import * as functionCreateClerkUsers from './functionCreateClerkUsers';

test('request mapping', () => {
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

test('response mapping', () => {
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
