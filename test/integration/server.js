const chai = require('chai');

const { expect } = chai;

describe('required environment variables', () => {
  it('should throw an exception when env vars are missing', () => {
    process.env.SEARCH_API_KEY = '';
    // eslint-disable-next-line global-require
    expect(() => { require('../../app'); })
      .to.throw(
        Error,
        'Environment variables missing'
      );
  });
});
