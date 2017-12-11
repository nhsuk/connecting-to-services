const dateUtils = require('../../../app/lib/dateUtils');
const chai = require('chai');

const expect = chai.expect;

describe('getDateString', () => {
  const nowDateString = new Date().toISOString().slice(0, 10);

  it('should return todays date as string when no argument supplied', () => {
    const result = dateUtils.getDateString();

    expect(result).to.be.equal(nowDateString);
  });

  it('should return todays date as string when null argument supplied', () => {
    const result = dateUtils.getDateString(null);

    expect(result).to.be.equal(nowDateString);
  });

  it('should return todays date as string when empty string argument supplied', () => {
    const result = dateUtils.getDateString('');

    expect(result).to.be.equal(nowDateString);
  });

  it('should return todays date as string when garbage string argument supplied', () => {
    const result = dateUtils.getDateString('garbage');

    expect(result).to.be.equal(nowDateString);
  });

  it('should return the date string of the supplied argument', () => {
    const dateString = '2020-02-02';
    const dateTimeString = `${dateString}T09:30:00.000Z`;
    const result = dateUtils.getDateString(dateTimeString);

    expect(result).to.be.equal(dateString);
  });
});
