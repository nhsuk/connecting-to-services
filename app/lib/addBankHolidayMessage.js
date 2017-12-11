const bankHolidayDates = require('../../data/bankHolidayDates');
const getDateString = require('../lib/dateUtils').getDateString;
const messages = require('../lib/messages');

function addBankHolidayMessage(orgs, dateStringOverride = process.env.DATE) {
  const nowDateString = getDateString(dateStringOverride);

  return orgs.map((org) => {
    const nextOpenDateString = getDateString(org.nextOpen);

    if (org.isOpen || nextOpenDateString === nowDateString) {
      if (bankHolidayDates.some(date => nowDateString === date)) {
        // eslint-disable-next-line no-param-reassign
        org.bankHolidayMessage = messages.bankHolidayToday();
      }
    } else {
      const nextOpenIsBankHoliday =
        bankHolidayDates.some(bankHolidayDate => nextOpenDateString === bankHolidayDate);

      if (nextOpenIsBankHoliday) {
        // eslint-disable-next-line no-param-reassign
        org.bankHolidayMessage = messages.bankHolidayFuture(nowDateString, nextOpenDateString);
      }
    }
    return org;
  });
}

module.exports = addBankHolidayMessage;
