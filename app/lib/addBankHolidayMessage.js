const bankHolidayDates = require('../../data/bankHolidayDates');
const messages = require('../lib/messages');

function getDateString(dateString = null) {
  // need to take into account the time zone as the containers are running GMT
  return new Date(dateString).toISOString().slice(0, 10);
}

function addBankHolidayMessage(orgs, dateStringOverride = process.env.DATE) {
  const nowDateString = getDateString(dateStringOverride);

  return orgs.map((org) => {
    if (org.isOpen) {
      if (bankHolidayDates.some(date => nowDateString === date)) {
        // eslint-disable-next-line no-param-reassign
        org.bankHolidayMessage = messages.bankHolidayToday();
      }
    } else {
      const nextOpenDateString = getDateString(org.nextOpen);
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
