const { PhoneNumberFormat: PNF } = require('google-libphonenumber');
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

const log = require('../logger');

function parsePhoneNumber(number) {
  if (!number) {
    return undefined;
  }
  try {
    const phoneNumber = phoneUtil.parse(number, 'GB');
    return phoneUtil.format(phoneNumber, PNF.NATIONAL);
  } catch (err) {
    log.info(`non-standard number: ${number}`);
    return number;
  }
}

module.exports = parsePhoneNumber;
