const chai = require('chai');
const isNotPostcode = require('../../../app/lib/isNotPostcode');

const expect = chai.expect;

describe('isNotPostcode', () => {
  it('should return false for an invalid postcode', () => {
    const result = isNotPostcode('Not a postcode');
    // eslint-disable-next-line no-unused-expressions
    expect(result).to.be.true;
  });
  it('should return false for a valid postcode', () => {
    const result = isNotPostcode('ls11 5qb');
    // eslint-disable-next-line no-unused-expressions
    expect(result).to.be.false;
  });
  it('should return false for a valid postcode with whitespace', () => {
    const result = isNotPostcode('ls11    5qb');
    // eslint-disable-next-line no-unused-expressions
    expect(result).to.be.false;
  });
  it('should return false for a valid postcode with no whitespace', () => {
    const result = isNotPostcode('ls115qb');
    // eslint-disable-next-line no-unused-expressions
    expect(result).to.be.false;
  });
  it('should return false for a valid outcode', () => {
    const result = isNotPostcode('ls1');
    // eslint-disable-next-line no-unused-expressions
    expect(result).to.be.false;
  });
});
