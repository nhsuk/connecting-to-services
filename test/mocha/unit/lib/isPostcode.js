const chai = require('chai');
const isPostcode = require('../../../../app/lib/isPostcode');

const expect = chai.expect;

describe('isPostcode', () => {
  it('should return false for an invalid postcode', () => {
    const result = isPostcode('Not a postcode');
    expect(result).to.be.false;
  });
  it('should return true for a valid postcode', () => {
    const result = isPostcode('ls11 5qb');
    expect(result).to.be.true;
  });
  it('should return true for a valid postcode with whitespace', () => {
    const result = isPostcode('ls11    5qb');
    expect(result).to.be.true;
  });
  it('should return true for a valid postcode with no whitespace', () => {
    const result = isPostcode('ls115qb');
    expect(result).to.be.true;
  });
  it('should return true for a valid outcode', () => {
    const result = isPostcode('ls1');
    expect(result).to.be.true;
  });
});
