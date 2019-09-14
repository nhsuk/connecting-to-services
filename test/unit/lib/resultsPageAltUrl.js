const chai = require('chai');
const resultsPageAltUrl = require('../../../app/lib/resultsPageAltUrl');

const expect = chai.expect;

const testDateTimes = {
  afterBusinessHours: '2018-03-14 18:00',
  middayDuringWeek: '2018-03-14 12:00',
};

describe('resultsPageAltUrl', () => {
  const latitude = 53;
  const longitude = 1;
  const path = '/results';
  const baseUrl = `${path}?latitude=${latitude}&longitude=${longitude}`;

  describe('during business hours', () => {
    beforeEach(() => {
      process.env.DATETIME = testDateTimes.middayDuringWeek;
    });

    it('should return a URL with the open param as true when the original request does not include open', () => {
      const url = resultsPageAltUrl({ path, query: { latitude, longitude } });

      expect(url).to.equal(`${baseUrl}&open=true`);
    });

    it('should return a URL with the open param as true when the original request includes open as false', () => {
      const url = resultsPageAltUrl({ path, query: { latitude, longitude, open: 'false' } });

      expect(url).to.equal(`${baseUrl}&open=true`);
    });

    it('should return a URL with the open param as true when the original request includes open with no value', () => {
      const url = resultsPageAltUrl({ path, query: { latitude, longitude, open: '' } });

      expect(url).to.equal(`${baseUrl}&open=true`);
    });

    it('should return a URL with the open param as false when the original request included open as true', () => {
      const url = resultsPageAltUrl({ path, query: { latitude, longitude, open: 'true' } });

      expect(url).to.equal(`${baseUrl}&open=false`);
    });

    it('should return a URL with the open param as false when the original request included open as TRUE', () => {
      const url = resultsPageAltUrl({ path, query: { latitude, longitude, open: 'TRUE' } });

      expect(url).to.equal(`${baseUrl}&open=false`);
    });
  });

  describe('outside of business hours', () => {
    beforeEach(() => {
      process.env.DATETIME = testDateTimes.afterBusinessHours;
    });

    it('should return a URL with the open param as false when the original request does not include open', () => {
      const url = resultsPageAltUrl({ path, query: { latitude, longitude } });

      expect(url).to.equal(`${baseUrl}&open=false`);
    });

    it('should return a URL with the open param as true when the original request includes open as false', () => {
      const url = resultsPageAltUrl({ path, query: { latitude, longitude, open: 'false' } });

      expect(url).to.equal(`${baseUrl}&open=true`);
    });

    it('should return a URL with the open param as false when the original request includes open with no value', () => {
      const url = resultsPageAltUrl({ path, query: { latitude, longitude, open: '' } });

      expect(url).to.equal(`${baseUrl}&open=false`);
    });

    it('should return a URL with the open param as false when the original request included open as true', () => {
      const url = resultsPageAltUrl({ path, query: { latitude, longitude, open: 'true' } });

      expect(url).to.equal(`${baseUrl}&open=false`);
    });

    it('should return a URL with the open param as false when the original request included open as TRUE', () => {
      const url = resultsPageAltUrl({ path, query: { latitude, longitude, open: 'TRUE' } });

      expect(url).to.equal(`${baseUrl}&open=false`);
    });
  });
});
