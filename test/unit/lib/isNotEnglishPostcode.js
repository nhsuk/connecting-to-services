const isNotEnglishPostcode = require('../../../app/lib/isNotEnglishPostcode');
const chai = require('chai');

const expect = chai.expect;

describe('isNotEnglishPostcode', () => {
  it('should return false for empty string', () => {
    const isNotEnglish = isNotEnglishPostcode('');
    expect(isNotEnglish).to.be.false;
  });

  it('should return false for non postcode string', () => {
    const isNotEnglish = isNotEnglishPostcode('BTTTT');
    expect(isNotEnglish).to.be.false;
  });

  it('should return true for Belfast outcode', () => {
    const isNotEnglish = isNotEnglishPostcode('BT1');
    expect(isNotEnglish).to.be.true;
  });

  it('should return true for Belfast postcode', () => {
    const isNotEnglish = isNotEnglishPostcode('BT29 4AB');
    expect(isNotEnglish).to.be.true;
  });

  it('should return false for postcodes ending in BT', () => {
    const isNotEnglish = isNotEnglishPostcode('LS1 4BT');
    expect(isNotEnglish).to.be.false;
  });

  it('should return true for Jersey outcode', () => {
    const isNotEnglish = isNotEnglishPostcode('JE1');
    expect(isNotEnglish).to.be.true;
  });

  it('should return true for Jersey postcode', () => {
    const isNotEnglish = isNotEnglishPostcode('JE1 1BY');
    expect(isNotEnglish).to.be.true;
  });

  it('should return false for postcodes ending in JE', () => {
    const isNotEnglish = isNotEnglishPostcode('LS1 4JE');
    expect(isNotEnglish).to.be.false;
  });

  it('should return true for Guernsey outcode', () => {
    const isNotEnglish = isNotEnglishPostcode('GY8');
    expect(isNotEnglish).to.be.true;
  });

  it('should return true for Guernsey postcode', () => {
    const isNotEnglish = isNotEnglishPostcode('GY8 0DS');
    expect(isNotEnglish).to.be.true;
  });

  it('should return false for postcodes ending in GY', () => {
    const isNotEnglish = isNotEnglishPostcode('LS1 4GY');
    expect(isNotEnglish).to.be.false;
  });

  it('should return true for Isle of Man outcode', () => {
    const isNotEnglish = isNotEnglishPostcode('IM1');
    expect(isNotEnglish).to.be.true;
  });

  it('should return true for Isle of Man postcode', () => {
    const isNotEnglish = isNotEnglishPostcode('IM9 2AS');
    expect(isNotEnglish).to.be.true;
  });

  it('should return false for postcodes ending in IM', () => {
    const isNotEnglish = isNotEnglishPostcode('LS1 4IM');
    expect(isNotEnglish).to.be.false;
  });
});
