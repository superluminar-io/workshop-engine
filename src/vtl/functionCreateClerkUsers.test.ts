import Parser from 'appsync-template-tester';
import { request, response } from './functionCreateClerkUsers';

describe('request mapping', () => {
  it('should match snapshot', () => {
    const parser = new Parser(request);

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
    const parser = new Parser(response);

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
