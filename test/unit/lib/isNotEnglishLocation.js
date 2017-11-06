const isNotEnglishLocation = require('../../../app/lib/isNotEnglishLocation');
const chai = require('chai');

const expect = chai.expect;

describe('isNotEnglishLocation', () => {
  it('should return false for empty string', () => {
    const isNotEnglish = isNotEnglishLocation('');
    expect(isNotEnglish).to.be.false;
  });

  it('should return false for non postcode string', () => {
    const isNotEnglish = isNotEnglishLocation('BTTTT');
    expect(isNotEnglish).to.be.false;
  });

  it('should return true for Belfast outcode', () => {
    const isNotEnglish = isNotEnglishLocation('BT1');
    expect(isNotEnglish).to.be.true;
  });

  it('should return true for Belfast postcode', () => {
    const isNotEnglish = isNotEnglishLocation('BT29 4AB');
    expect(isNotEnglish).to.be.true;
  });

  it('should return false for postcodes ending in BT', () => {
    const isNotEnglish = isNotEnglishLocation('LS1 4BT');
    expect(isNotEnglish).to.be.false;
  });

  it('should return true for Jersey outcode', () => {
    const isNotEnglish = isNotEnglishLocation('JE1');
    expect(isNotEnglish).to.be.true;
  });

  it('should return true for Jersey postcode', () => {
    const isNotEnglish = isNotEnglishLocation('JE1 1BY');
    expect(isNotEnglish).to.be.true;
  });

  it('should return false for postcodes ending in JE', () => {
    const isNotEnglish = isNotEnglishLocation('LS1 4JE');
    expect(isNotEnglish).to.be.false;
  });

  it('should return true for Guernsey outcode', () => {
    const isNotEnglish = isNotEnglishLocation('GY8');
    expect(isNotEnglish).to.be.true;
  });

  it('should return true for Guernsey postcode', () => {
    const isNotEnglish = isNotEnglishLocation('GY8 0DS');
    expect(isNotEnglish).to.be.true;
  });

  it('should return false for postcodes ending in GY', () => {
    const isNotEnglish = isNotEnglishLocation('LS1 4GY');
    expect(isNotEnglish).to.be.false;
  });

  it('should return true for Isle of Man outcode', () => {
    const isNotEnglish = isNotEnglishLocation('IM1');
    expect(isNotEnglish).to.be.true;
  });

  it('should return true for Isle of Man postcode', () => {
    const isNotEnglish = isNotEnglishLocation('IM9 2AS');
    expect(isNotEnglish).to.be.true;
  });

  it('should return false for postcodes ending in IM', () => {
    const isNotEnglish = isNotEnglishLocation('LS1 4IM');
    expect(isNotEnglish).to.be.false;
  });
});
