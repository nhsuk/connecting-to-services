const chai = require('chai');

const expect = chai.expect;

describe('required environment variables', () => {
  it('should throw an exception when env vars are missing', () => {
    // eslint-disable-next-line global-require
    expect(() => { require('../../app'); })
    .to.throw(Error,
      'Environment variables missing');
  });
});
