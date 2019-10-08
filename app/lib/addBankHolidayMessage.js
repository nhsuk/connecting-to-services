const moment = require('moment');
const { isBankHoliday } = require('../lib/dateUtils');
const { getDateTime } = require('../lib/dateUtils');
const messages = require('../lib/messages');

function addBankHolidayMessage(orgs) {
  const nowDateString = getDateTime().format('YYYY-MM-DD');

  return orgs.map((org) => {
    const nextOpenDateString = moment(org.nextOpen).format('YYYY-MM-DD');

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
