const bankHolidayDates = require('../../data/bankHolidayDates');
const dayInMilliseconds = require('../lib/constants').dayInMilliseconds;

function displayBankHolidayMessage(date = process.env.DATETIME) {
  let nowTime;

  if (date) {
    nowTime = new Date(date).getTime();
  } else {
    nowTime = new Date().getTime();
  }

  const periodBeforeToDisplayMessage = dayInMilliseconds;
  let displayMessage = false;

  bankHolidayDates.some((bankHolidayDate) => {
    const bankHolidayDateTime = new Date(bankHolidayDate).getTime();
    const timeDiff = nowTime - bankHolidayDateTime;
    if (timeDiff >= (0 - periodBeforeToDisplayMessage) && timeDiff < periodBeforeToDisplayMessage) {
      displayMessage = true;
    }
    return displayMessage;
  });
  return displayMessage;
}

module.exports = displayBankHolidayMessage;
