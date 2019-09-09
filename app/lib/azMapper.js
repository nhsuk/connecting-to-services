const distanceCalculation = require('./displayUtils/calculateDistance');
const phoneNumberParser = require('./displayUtils/phoneNumberParser');
const getMessages = require('./getMessages');
const getOpeningTimes = require('./azOpeningTimesMapper');

function getContacts(asContacts) {
  const contacts = JSON.parse(asContacts);
  const contactDetails = {};

  contacts.forEach((c) => {
    if (c.OrganisationContactType === 'Primary') {
      const type = c.OrganisationContactMethodType;
      const lowerType = type ? type.toLowerCase() : '';
      switch (lowerType) {
        case 'fax':
        case 'telephone':
          contactDetails[lowerType] = phoneNumberParser(c.OrganisationContactValue);
          break;
        default:
          contactDetails[lowerType] = c.OrganisationContactValue;
      }
    }
  });
  return contactDetails;
}

function getDistanceInMiles(origin, destination) {
  return distanceCalculation(origin, destination);
}

function getOpeningTimesMessage(openingTimes, hasPhoneNumber, datetime) {
  return getMessages(openingTimes, hasPhoneNumber, datetime);
}

module.exports = (org, origin, datetime) => {
  const contacts = getContacts(org.Contacts);
  const hasPhoneNumber = contacts && contacts.telephone;
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
