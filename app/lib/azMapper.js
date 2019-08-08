const distanceCalculation = require('./displayUtils/calculateDistance');
const phoneNumberParser = require('./displayUtils/phoneNumberParser');
const getMessages = require('./getMessages');
const getOpeningTimes = require('./azOpeningTimesMapper');

function getPrimaryContactByType(contacts, type) {
  const contactDetails = contacts.find(
    c => c.OrganisationContactType === 'Primary' && c.OrganisationContactMethodType === type
  );
  return contactDetails ? contactDetails.OrganisationContactValue : '';
}

function getContacts(asContacts) {
  const contacts = JSON.parse(asContacts);

  return {
    email: getPrimaryContactByType(contacts, 'Email'),
    fax: phoneNumberParser(getPrimaryContactByType(contacts, 'Fax')),
    telephoneNumber: phoneNumberParser(getPrimaryContactByType(contacts, 'Telephone')),
    website: getPrimaryContactByType(contacts, 'Website'),
  };
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
  const orgCoordinates = {
    latitude: org.Geocode.coordinates[1],
    longitude: org.Geocode.coordinates[0],
  };
  const mappedOrg = {
    /* eslint-disable sort-keys */
    identifier: org.NACSCode,
    name: org.OrganisationName,
    address: {
      line1: org.Address1 || '',
      line2: org.Address2 || '',
      line3: org.Address3 || '',
      city: org.City || '',
      county: org.County || '',
      postcode: org.Postcode || '',
    },
    contacts,
    openingTimes,
    distanceInMiles: getDistanceInMiles(origin, orgCoordinates),
    isOpen,
    openingTimesMessage,
    nextOpen,
  };

  return mappedOrg;
};
