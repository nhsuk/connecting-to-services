const calculateDistance = require('../displayUtils/calculateDistance');
const getMessage = require('../getMessage');
const getOpeningTimes = require('./azOpeningTimesMapper');
const getContacts = require('./azContactMapper');

function getValueOrDefault(value) {
  return value || '';
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

  const address = {
    city: getValueOrDefault(org.City),
    county: getValueOrDefault(org.County),
    line1: getValueOrDefault(org.Address1),
    line2: getValueOrDefault(org.Address2),
    line3: getValueOrDefault(org.Address3),
    postcode: getValueOrDefault(org.Postcode),
  };

  const mappedOrg = {
    address,
    contacts,
    distanceInMiles: calculateDistance(origin, orgCoordinates),
    identifier: org.NACSCode,
    isOpen,
    name: org.OrganisationName,
    nextOpen,
    openingTimes,
    openingTimesMessage,
  };

  return mappedOrg;
};
