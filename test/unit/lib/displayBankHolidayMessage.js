const chai = require('chai');
const displayBankHolidayMessage = require('../../../app/lib/displayBankHolidayMessage');

const expect = chai.expect;

describe('displayBankHolidayMessage', () => {
  it('should return true when the date is a bank holiday', () => {
    const bankHoliday = '2017-12-25';

    const result = displayBankHolidayMessage(bankHoliday);

    expect(result).to.be.true;
  });

  it('should return true when the date is the day before a bank holiday', () => {
    const dayBeforeBankHoliday = '2017-12-24';

    const result = displayBankHolidayMessage(dayBeforeBankHoliday);

    expect(result).to.be.true;
  });

  it('should return false when the date is the day after a bank holiday', () => {
    const dayAfterBankHoliday = '2017-12-27';

    const result = displayBankHolidayMessage(dayAfterBankHoliday);

    expect(result).to.be.false;
  });

  describe('setting process.env.DATETIME', () => {
    beforeEach('reset DATETIME', () => {
      process.env.DATETIME = null;
    });

    afterEach('reset DATETIME', () => {
      process.env.DATETIME = null;
    });

    it('should return false when the date is the day after a bank holiday', () => {
      process.env.DATETIME = '2017-12-27';

      const result = displayBankHolidayMessage();

      expect(result).to.be.false;
    });
  });
});
