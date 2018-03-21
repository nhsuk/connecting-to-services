const chai = require('chai');
const moment = require('moment');

const resultsPageAltUrl = require('../../../app/lib/resultsPageAltUrl');

const expect = chai.expect;

describe('resultsPageAltUrl', () => {
  const latitude = 53;
  const longitude = 1;
  const path = '/results';
  const baseUrl = `${path}?latitude=${latitude}&longitude=${longitude}`;

  describe('during business hours', () => {
    const middayDuringWeek = moment('2018-03-14T12:00:00');

    it('should return a URL with the open param as true when the original request does not include open', () => {
      const url = resultsPageAltUrl({ path, query: { latitude, longitude } }, middayDuringWeek);

      expect(url).to.equal(`${baseUrl}&open=true`);
    });

    it('should return a URL with the open param as true when the original request includes open as false', () => {
      const url = resultsPageAltUrl({ path, query: { latitude, longitude, open: 'false' } }, middayDuringWeek);

      expect(url).to.equal(`${baseUrl}&open=true`);
    });

    it('should return a URL with the open param as true when the original request includes open with no value', () => {
      const url = resultsPageAltUrl({ path, query: { latitude, longitude, open: '' } }, middayDuringWeek);

      expect(url).to.equal(`${baseUrl}&open=true`);
    });

    it('should return a URL with the open param as false when the original request included open as true', () => {
      const url = resultsPageAltUrl({ path, query: { latitude, longitude, open: 'true' } }, middayDuringWeek);

      expect(url).to.equal(`${baseUrl}&open=false`);
    });

    it('should return a URL with the open param as false when the original request included open as TRUE', () => {
      const url = resultsPageAltUrl({ path, query: { latitude, longitude, open: 'TRUE' } }, middayDuringWeek);

      expect(url).to.equal(`${baseUrl}&open=false`);
    });
  });

  describe('outside of business hours', () => {
    const outsideBusinessHours = moment('2018-03-14T23:00:00');

    it('should return a URL with the open param as false when the original request does not include open', () => {
      const url = resultsPageAltUrl({ path, query: { latitude, longitude } }, outsideBusinessHours);

      expect(url).to.equal(`${baseUrl}&open=false`);
    });

    it('should return a URL with the open param as true when the original request includes open as false', () => {
      const url = resultsPageAltUrl({ path, query: { latitude, longitude, open: 'false' } }, outsideBusinessHours);

      expect(url).to.equal(`${baseUrl}&open=true`);
    });

    it('should return a URL with the open param as false when the original request includes open with no value', () => {
      const url = resultsPageAltUrl({ path, query: { latitude, longitude, open: '' } }, outsideBusinessHours);

      expect(url).to.equal(`${baseUrl}&open=false`);
    });

    it('should return a URL with the open param as false when the original request included open as true', () => {
      const url = resultsPageAltUrl({ path, query: { latitude, longitude, open: 'true' } }, outsideBusinessHours);

      expect(url).to.equal(`${baseUrl}&open=false`);
    });

    it('should return a URL with the open param as false when the original request included open as TRUE', () => {
      const url = resultsPageAltUrl({ path, query: { latitude, longitude, open: 'TRUE' } }, outsideBusinessHours);

      expect(url).to.equal(`${baseUrl}&open=false`);
    });
  });
});
