import Parser from 'appsync-template-tester';
import { request, response } from './functionAcceptInvitation';

describe('request mapping', () => {
  it('should match snapshot', () => {
    const parser = new Parser(request);

    const context = {
      arguments: {
        inviteId: 'c87c4461-ad5a-45ce-bc42-87e9b10e1bab',
        emailAddress: 'me@xample.com',
      },
    };

    expect(parser.resolve(context)).toMatchSnapshot();
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
