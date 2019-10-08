const calculateDistance = require('../displayUtils/calculateDistance');
const getMessage = require('../getMessage');
const getOpeningTimes = require('./azOpeningTimesMapper');
const getContacts = require('./azContactMapper');
const getAddress = require('./azAddressMapper');

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
    address: getAddress(org),
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
