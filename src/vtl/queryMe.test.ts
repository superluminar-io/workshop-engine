import Parser from 'appsync-template-tester';
import * as queryMe from './queryMe';

const me = {
  emailAddress: 'me@example.com',
  role: 'ADMIN',
};

describe('request mapping', () => {
  it('should match snapshot', () => {
    const parser = new Parser(queryMe.request);

    const context = {
      identity: {
        resolverContext: me,
      },
    };

    expect(parser.resolve(context)).toMatchSnapshot();
  });
});

describe('response mapping', () => {
  it('should match snapshot', () => {
    const parser = new Parser(queryMe.response);

    const context = {
      result: me,
    };

    expect(parser.resolve(context)).toMatchSnapshot();
  });
});
