import Parser from 'appsync-template-tester';
import { request, response } from './mutationCreateWorkshop';

describe('request mapping', () => {
  it('should match snapshot', () => {
    const parser = new Parser(request);

    expect(parser.resolve({})).toMatchSnapshot();
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
