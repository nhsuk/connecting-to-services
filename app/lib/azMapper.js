const moment = require('moment');
const distanceCalculation = require('./displayUtils/calculateDistance');
const getMessages = require('./getMessages');

function getPrimaryContactByType(contacts, type) {
  const contactDetails = contacts.find(
    c => c.OrganisationContactType === 'Primary' && c.OrganisationContactMethodType === type
  );
  return contactDetails ? contactDetails.OrganisationContactValue : null;
}

function getContacts(asContacts) {
  const contacts = JSON.parse(asContacts);

  return {
    email: getPrimaryContactByType(contacts, 'Email'),
    fax: getPrimaryContactByType(contacts, 'Fax'),
    telephoneNumber: getPrimaryContactByType(contacts, 'Telephone'),
    website: getPrimaryContactByType(contacts, 'Website'),
  };
}

function getOpeningTimes(asOpeningTimes) {
  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const openingTimes = {
    alterations: {},
    general: {},
  };

  weekdays.forEach((weekday) => {
    const sessions = asOpeningTimes
      .filter(ot => ot.OpeningTimeType === 'General' && ot.Weekday === weekday)
      .map((dot) => {
        const splitTimes = dot.Times.split('-');
        const opens = splitTimes[0];
        const closes = splitTimes[1];
        return { closes, opens };
      });
    openingTimes.general[weekday.toLowerCase()] = sessions;
  });

  asOpeningTimes
    .filter(ot => ot.OpeningTimeType === 'General' && ot.AdditionalOpeningDate)
    .forEach((aot) => {
      const aMoment = moment(aot.AdditionalOpeningDate, 'MMM DD YYYY');
      if (!aot.isOpen) {
        openingTimes.alterations[aMoment.format('YYYY-MM-DD')] = [];
      }
    });

  return openingTimes;
}

function getDistanceInMiles(origin, destination) {
  return distanceCalculation(origin, destination);
}

function getOpeningTimesMessage(openingTimes, hasPhoneNumber, datetime) {
  return getMessages(openingTimes, hasPhoneNumber, datetime);
}

module.exports = (org, origin, datetime) => {
  const contacts = getContacts(org.Contacts);
  const hasPhoneNumber = contacts && contacts.telephoneNumber;
  const openingTimes = getOpeningTimes(org.OpeningTimesV2);
  const {
    isOpen,
    openingTimesMessage,
    nextOpen,
  } = getOpeningTimesMessage(openingTimes, hasPhoneNumber, datetime);
  const mappedOrg = {
    /* eslint-disable sort-keys */
    name: org.OrganisationName,
    address: {
      line1: org.Address1,
      line2: org.Address2,
      line3: org.Address3,
      city: org.City,
      county: org.County,
      postcode: org.Postcode,
    },
    contacts,
    openingTimes,
    distanceInMiles: getDistanceInMiles(origin, { lat: org.Latitude, lon: org.Longitude }),
    isOpen,
    openingTimesMessage,
    nextOpen,
  };

  return mappedOrg;
};
