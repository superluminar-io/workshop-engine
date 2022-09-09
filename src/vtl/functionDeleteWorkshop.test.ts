import Parser from 'appsync-template-tester';
import { request, response } from './functionDeleteWorkshop';

describe('request mapping', () => {
  it('should match snapshot', () => {
    const parser = new Parser(request);

    const context = {
      arguments: {
        workshopId: 'beb79a10-437e-48df-96e2-9cd87fdc063f',
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
