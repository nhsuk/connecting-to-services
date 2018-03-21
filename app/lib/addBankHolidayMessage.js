const isBankHoliday = require('../lib/dateUtils').isBankHoliday;
const getDateString = require('../lib/dateUtils').getDateString;
const messages = require('../lib/messages');

function addBankHolidayMessage(orgs, dateStringOverride = process.env.DATETIME) {
  const nowDateString = getDateString(dateStringOverride);

  return orgs.map((org) => {
    const nextOpenDateString = getDateString(org.nextOpen);

    if (org.isOpen || nextOpenDateString === nowDateString) {
      if (isBankHoliday(nowDateString)) {
        // eslint-disable-next-line no-param-reassign
        org.bankHolidayMessage = messages.bankHolidayToday();
      }
    } else if (isBankHoliday(nextOpenDateString)) {
      // eslint-disable-next-line no-param-reassign
      org.bankHolidayMessage = messages.bankHolidayFuture(nowDateString, nextOpenDateString);
    }
    return org;
  });
}

module.exports = addBankHolidayMessage;
