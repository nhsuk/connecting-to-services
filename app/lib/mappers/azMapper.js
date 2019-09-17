const calculateDistance = require('../displayUtils/calculateDistance');
const phoneNumberParser = require('../displayUtils/phoneNumberParser');
const getMessage = require('../getMessage');
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

module.exports = (org, origin, datetime) => {
  const contacts = getContacts(org.Contacts);
  const hasPhoneNumber = contacts && contacts.telephone;
  const openingTimes = getOpeningTimes(org.OpeningTimesV2);
  const {
    isOpen,
    openingTimesMessage,
    nextOpen,
  } = getMessage(openingTimes, hasPhoneNumber, datetime);
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
    distanceInMiles: calculateDistance(origin, orgCoordinates),
    isOpen,
    openingTimesMessage,
    nextOpen,
    /* eslint-enable sort-keys */
  };

  return mappedOrg;
};
