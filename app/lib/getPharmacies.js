const debugGetPharmacies = require('../../app/lib/debuggers').getPharmacies;
const OpeningTimes = require('moment-opening-times');
const moment = require('moment');
const geolib = require('geolib');
const assert = require('assert');
const utils = require('../lib/utils');

const metersInAMile = 1609;

function sortByDistance(a, b) {
  return a.distanceInMiles - b.distanceInMiles;
}

function getDistanceInMiles(start, end) {
  const distanceInMeters = geolib.getDistance(start, end);
  return distanceInMeters / metersInAMile;
}

function nearby(searchPoint, geo, limit) {
  assert(searchPoint, 'searchPoint can not be null');
  assert.equal(typeof (searchPoint.latitude), 'number',
      'searchPoint must contain a property named latitude');
  assert.equal(typeof (searchPoint.longitude), 'number',
      'searchPoint must contain a property named longitude');

  assert(geo, 'geo can not be null');
  assert.equal(typeof (geo.nearBy), 'function',
      'geo must contain a nearBy function');

  const maxResults = limit || 10;
  const numberOfOpenToReturn = 3;
  const openServices = [];
  let serviceCount = 0;
  let openServiceCount = 0;

  debugGetPharmacies('get-nearby-results');
  const nearbyGeo =
    geo.nearBy(searchPoint.latitude, searchPoint.longitude, 50 * metersInAMile);
  debugGetPharmacies('get-nearby-results');

  debugGetPharmacies(`Found ${nearbyGeo.length} nearby results`);
  debugGetPharmacies('add-distance');
  const nearbyOrgs = nearbyGeo.map((item) => {
    // eslint-disable-next-line no-param-reassign
    item.distanceInMiles = getDistanceInMiles(searchPoint, item);

    return item;
  });
  debugGetPharmacies('add-distance');

  debugGetPharmacies('sort-nearby-results');
  const sortedOrgs = nearbyOrgs.sort(sortByDistance);
  debugGetPharmacies('sort-nearby-results');

  debugGetPharmacies('filter-open-results');
  for (let i = 0; i < sortedOrgs.length; i++) {
    const item = sortedOrgs[i];
    const openingTimes = item.openingTimes;
    const now = moment();
    let isOpen;
    let openingTimesMessage;

    if (openingTimes) {
      const openingTimesMoment = new OpeningTimes(item.openingTimes.general, 'Europe/London');
      openingTimesMessage = openingTimesMoment.getOpeningHoursMessage(now);
      isOpen = openingTimesMoment.isOpen(now);
      if (isOpen && openServiceCount < numberOfOpenToReturn) {
        openServiceCount++;
        openServices.push(utils.deepClone(item));
      }
    } else {
      openingTimesMessage = 'Call for opening times';
      isOpen = false;
    }
    serviceCount++;
    /* eslint-disable no-param-reassign */
    item.openingTimesMessage = openingTimesMessage;
    item.isOpen = isOpen;
    /* eslint-enable no-param-reassign */

    if (openServiceCount >= numberOfOpenToReturn && serviceCount >= maxResults) {
      break;
    }
  }
  debugGetPharmacies('filter-open-results');

  return {
    nearbyServices: sortedOrgs.slice(0, maxResults),
    openServices,
  };
}

module.exports = {
  nearby,
};
