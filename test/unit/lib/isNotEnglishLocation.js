const isNotEnglishLocation = require('../../../app/lib/isNotEnglishLocation');
const chai = require('chai');

const expect = chai.expect;

describe('isNotEnglishLocation', () => {
  it('should return false for empty string', () => {
    const isNotEnglish = isNotEnglishLocation('');
    // eslint-disable-next-line no-unused-expressions
    expect(isNotEnglish).to.be.false;
  });

  it('should return false for non postcode string', () => {
    const isNotEnglish = isNotEnglishLocation('BTTTT');
    // eslint-disable-next-line no-unused-expressions
    expect(isNotEnglish).to.be.false;
  });

  it('should return true for Belfast outcode', () => {
    const isNotEnglish = isNotEnglishLocation('BT1');
    // eslint-disable-next-line no-unused-expressions
    expect(isNotEnglish).to.be.true;
  });

  it('should return true for Belfast postcode', () => {
    const isNotEnglish = isNotEnglishLocation('BT29 4AB');
    // eslint-disable-next-line no-unused-expressions
    expect(isNotEnglish).to.be.true;
  });

  it('should return false for postcodes ending in BT', () => {
    const isNotEnglish = isNotEnglishLocation('LS1 4BT');
    // eslint-disable-next-line no-unused-expressions
    expect(isNotEnglish).to.be.false;
  });

  it('should return true for Jersey outcode', () => {
    const isNotEnglish = isNotEnglishLocation('JE1');
    // eslint-disable-next-line no-unused-expressions
    expect(isNotEnglish).to.be.true;
  });

  it('should return true for Jersey postcode', () => {
    const isNotEnglish = isNotEnglishLocation('JE1 1BY');
    // eslint-disable-next-line no-unused-expressions
    expect(isNotEnglish).to.be.true;
  });

  it('should return false for postcodes ending in JE', () => {
    const isNotEnglish = isNotEnglishLocation('LS1 4JE');
    // eslint-disable-next-line no-unused-expressions
    expect(isNotEnglish).to.be.false;
  });

  it('should return true for Guernsey outcode', () => {
    const isNotEnglish = isNotEnglishLocation('GY8');
    // eslint-disable-next-line no-unused-expressions
    expect(isNotEnglish).to.be.true;
  });

  it('should return true for Guernsey postcode', () => {
    const isNotEnglish = isNotEnglishLocation('GY8 0DS');
    // eslint-disable-next-line no-unused-expressions
    expect(isNotEnglish).to.be.true;
  });

  it('should return false for postcodes ending in GY', () => {
    const isNotEnglish = isNotEnglishLocation('LS1 4GY');
    // eslint-disable-next-line no-unused-expressions
    expect(isNotEnglish).to.be.false;
  });

  it('should return true for Isle of Man outcode', () => {
    const isNotEnglish = isNotEnglishLocation('IM1');
    // eslint-disable-next-line no-unused-expressions
    expect(isNotEnglish).to.be.true;
  });

  it('should return true for Isle of Man postcode', () => {
    const isNotEnglish = isNotEnglishLocation('IM9 2AS');
    // eslint-disable-next-line no-unused-expressions
    expect(isNotEnglish).to.be.true;
  });

  it('should return false for postcodes ending in IM', () => {
    const isNotEnglish = isNotEnglishLocation('LS1 4IM');
    // eslint-disable-next-line no-unused-expressions
    expect(isNotEnglish).to.be.false;
  });
});
