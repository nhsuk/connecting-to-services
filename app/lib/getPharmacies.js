const OpeningTimes = require('moment-opening-times');
const moment = require('moment');
const geolib = require('geolib');
const assert = require('assert');

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
  // TODO: Look at starting with a small range and increasing only if not
  // enough results have been returned - mainly to reduce time later on
  console.time('get-nearby-orgs');
  const nearbyGeo =
    geo.nearBy(searchPoint.latitude, searchPoint.longitude, 50 * metersInAMile);
  console.timeEnd('get-nearby-orgs');

  console.log(`Found ${nearbyGeo.length} results`);
  console.time('add-distance-search');
  const nearbyOrgs = nearbyGeo.map((item) => {
    // eslint-disable-next-line no-param-reassign
    item.distanceInMiles = getDistanceInMiles(searchPoint, item);

    return item;
  });
  console.timeEnd('add-distance-search');

  console.time('sort-nearby-orgs');
  const sortedOrgs = nearbyOrgs.sort(sortByDistance);
  console.timeEnd('sort-nearby-orgs');

  const numberOfOpenToReturn = 3;
  let numberReturned = 0;

  console.time('filter-open-orgs');
  const openServices = sortedOrgs.filter((item) => {
    // TODO: Look at breaking out of the loop once three have been found
    const openingTimes = item.openingTimes;
    let isOpen;
    let openingTimesMessage;

    if (openingTimes) {
      const openingTimesMoment = new OpeningTimes(item.openingTimes.general, 'Europe/London');
      openingTimesMessage = openingTimesMoment.getOpeningHoursMessage(moment());
      isOpen = openingTimesMoment.isOpen(moment());
    } else {
      openingTimesMessage = 'Call for opening times';
      isOpen = false;
    }
    /* eslint-disable no-param-reassign */
    item.openingTimesMessage = openingTimesMessage;
    item.isOpen = isOpen;
    /* eslint-enable no-param-reassign */

    if (numberReturned < numberOfOpenToReturn && item.isOpen) {
      numberReturned++;
      return true;
    }
    return false;
  });
  console.timeEnd('filter-open-orgs');

  return {
    nearbyServices: sortedOrgs.slice(0, maxResults),
    openServices,
  };
}

module.exports = {
  nearby,
};
