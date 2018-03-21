const chai = require('chai');
const moment = require('moment');

const bankHolidayDates = require('../../../data/bankHolidayDates');
const businessHours = require('../../../config/config').businessHours;
const dateUtils = require('../../../app/lib/dateUtils');

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

  describe('isBankHoliday', () => {
    it('should return true when date is contained in bank holiday list', () => {
      const bankHolidayDateString = bankHolidayDates[0];

      const result = dateUtils.isBankHoliday(bankHolidayDateString);

      expect(result).to.be.true;
    });

    it('should return false when date is contained in bank holiday list', () => {
      const bankHolidayDateString = '2015-01-01';

      const result = dateUtils.isBankHoliday(bankHolidayDateString);

      expect(result).to.be.false;
    });
  });

  describe('isNextOpenTomorrow', () => {
    it('should return true when it is next open tomorrow', () => {
      const nowDateString = '2017-01-02';
      const nextOpenDateString = '2017-01-03';

      const result = dateUtils.isNextOpenTomorrow(nowDateString, nextOpenDateString);

      expect(result).to.be.true;
    });

    it('should return false when it is next open today', () => {
      const nowDateString = '2017-01-02';
      const nextOpenDateString = '2017-01-02';

      const result = dateUtils.isNextOpenTomorrow(nowDateString, nextOpenDateString);

      expect(result).to.be.false;
    });

    it('should return false when it is next open yesterday', () => {
      const nowDateString = '2017-01-02';
      const nextOpenDateString = '2017-01-01';

      const result = dateUtils.isNextOpenTomorrow(nowDateString, nextOpenDateString);

      expect(result).to.be.false;
    });

    it('should return false when dates are not valid', () => {
      const nowDateString = 'unknown';
      const nextOpenDateString = 'incorrect';

      const result = dateUtils.isNextOpenTomorrow(nowDateString, nextOpenDateString);

      expect(result).to.be.false;
    });
  });

  describe('isTimeOutsideBusinessHours', () => {
    const dayOfWeekDateString = '2018-03-14';
    const businessHoursStartMoment =
      moment(dayOfWeekDateString)
        .hour(businessHours.start.hour)
        .minute(businessHours.start.minute);
    const businessHoursEndMoment =
      moment(dayOfWeekDateString)
        .hour(businessHours.end.hour)
        .minute(businessHours.end.minute);

    it('should return true when time is before ths start of business hours', () => {
      const secondBeforeBusinessHoursStartMoment = businessHoursStartMoment.clone().second(-1);

      const result = dateUtils.isTimeOutsideBusinessHours(secondBeforeBusinessHoursStartMoment);

      expect(result).to.be.true;
    });

    it('should return false when time is the start of business hours', () => {
      const result = dateUtils.isTimeOutsideBusinessHours(businessHoursStartMoment);

      expect(result).to.be.false;
    });

    it('should return false when time is before the end of business hours', () => {
      const secondBeforeBusinessHoursEndMoment = businessHoursEndMoment.clone().second(-1);

      const result = dateUtils.isTimeOutsideBusinessHours(secondBeforeBusinessHoursEndMoment);

      expect(result).to.be.false;
    });

    it('should return true when time is the end of business hours', () => {
      const result = dateUtils.isTimeOutsideBusinessHours(businessHoursEndMoment);

      expect(result).to.be.true;
    });
  });

  describe('isWeekday', () => {
    it('should return true for Monday', () => {
      const testMoment = moment().day('Monday');

      const result = dateUtils.isWeekday(testMoment);

      expect(result).to.be.true;
    });

    it('should return true for Tuesday', () => {
      const testMoment = moment().day('Tuesday');

      const result = dateUtils.isWeekday(testMoment);

      expect(result).to.be.true;
    });

    it('should return true for Wednesday', () => {
      const testMoment = moment().day('Wednesday');

      const result = dateUtils.isWeekday(testMoment);

      expect(result).to.be.true;
    });

    it('should return true for Thursday', () => {
      const testMoment = moment().day('Thursday');

      const result = dateUtils.isWeekday(testMoment);

      expect(result).to.be.true;
    });

    it('should return true for Friday', () => {
      const testMoment = moment().day('Friday');

      const result = dateUtils.isWeekday(testMoment);

      expect(result).to.be.true;
    });

    it('should return false for Saturday', () => {
      const testMoment = moment().day('Saturday');

      const result = dateUtils.isWeekday(testMoment);

      expect(result).to.be.false;
    });

    it('should return false for Sunday', () => {
      const testMoment = moment().day('Sunday');

      const result = dateUtils.isWeekday(testMoment);

      expect(result).to.be.false;
    });
  });
});
