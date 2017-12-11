const dateUtils = require('../../../app/lib/dateUtils');
const chai = require('chai');

const expect = chai.expect;

describe('dateUtils', () => {
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

  describe('getDay', () => {
    it('should return the name of the day the date is for - Sunday', () => {
      const sundayDate = '2018-07-01';

      const day = dateUtils.getDay(sundayDate);

      expect(day).to.be.equal('Sunday');
    });

    it('should return the name of the day the date is for - Monday', () => {
      const mondayDate = '2018-07-02';

      const day = dateUtils.getDay(mondayDate);

      expect(day).to.be.equal('Monday');
    });

    it('should return the name of the day the date is for - Tuesday', () => {
      const tuesdayDate = '2018-07-03';

      const day = dateUtils.getDay(tuesdayDate);

      expect(day).to.be.equal('Tuesday');
    });

    it('should return the name of the day the date is for - Wednesday', () => {
      const wednesdayDate = '2018-07-04';

      const day = dateUtils.getDay(wednesdayDate);

      expect(day).to.be.equal('Wednesday');
    });

    it('should return the name of the day the date is for - Thursday', () => {
      const thursdayDate = '2018-07-05';

      const day = dateUtils.getDay(thursdayDate);

      expect(day).to.be.equal('Thursday');
    });

    it('should return the name of the day the date is for - Friday', () => {
      const fridayDate = '2018-07-06';

      const day = dateUtils.getDay(fridayDate);

      expect(day).to.be.equal('Friday');
    });

    it('should return the name of the day the date is for - Saturday', () => {
      const saturdayDate = '2018-07-07';

      const day = dateUtils.getDay(saturdayDate);

      expect(day).to.be.equal('Saturday');
    });
  });
});
