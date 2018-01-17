const chai = require('chai');

const displayOpenResults = require('../../../app/lib/displayOpenResults');

const expect = chai.expect;

describe('displayOpenResults', () => {
  it('should return true when query contains open and it is true', () => {
    const result = displayOpenResults({ query: { open: 'true' } });

    expect(result).to.equal(true);
  });

  it('should return true when query contains open and it is TRUE', () => {
    const result = displayOpenResults({ query: { open: 'TRUE' } });

    expect(result).to.equal(true);
  });

  it('should return false when query does not contain open', () => {
    const result = displayOpenResults({ query: { } });

    expect(result).to.equal(false);
  });

  it('should return false when query contains open and it is not equal to true', () => {
    const result = displayOpenResults({ query: { open: 'NOT true' } });

    expect(result).to.equal(false);
  });
});
