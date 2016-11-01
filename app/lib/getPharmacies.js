const log = require('../../app/lib/logger');
const OpeningTimes = require('moment-opening-times');
const moment = require('moment');
const geolib = require('geolib');
const assert = require('assert');
const utils = require('../lib/utils');
const getOpeningHoursMessage = require('../lib/getOpeningTimesMessage');

const metersInAMile = 1609;

function sortByDistance(a, b) {
  return a.distanceInMiles - b.distanceInMiles;
}

function getDistanceInMiles(start, end) {
  const distanceInMeters = geolib.getDistance(start, end);
  return distanceInMeters / metersInAMile;
}

function nearbyRingSearch(searchPoint, geo, limits, searchRing) {
  const numberOfOpenToReturn = limits.open;
  const openServices = [];
  let serviceCount = 0;
  let openServiceCount = 0;
  let nearbyGeo;

  log.debug('get-nearby-results-start');
  if (searchRing.start < 1) {
    nearbyGeo =
      geo.nearBy(
        searchPoint.latitude,
        searchPoint.longitude,
        searchRing.end * metersInAMile);
  } else {
    nearbyGeo =
      geo.nearBy(
        searchPoint.latitude,
        searchPoint.longitude,
        [(searchRing.start * metersInAMile) + 1, searchRing.end * metersInAMile]);
  }
  log.debug('get-nearby-results-end');

  log.debug(`Found ${nearbyGeo.length} nearby results`);
  log.debug('add-distance-start');
  const nearbyOrgs = nearbyGeo.map((item) => {
    // eslint-disable-next-line no-param-reassign
    item.distanceInMiles = getDistanceInMiles(searchPoint, item);

    return item;
  });
  log.debug('add-distance-end');

  log.debug('sort-nearby-results-start');
  const sortedOrgs = nearbyOrgs.sort(sortByDistance);
  log.debug('sort-nearby-results-end');

  log.debug('filter-open-results-start');
  for (let i = 0; i < sortedOrgs.length; i++) {
    const item = sortedOrgs[i];
    const openingTimes = item.openingTimes;
    const now = moment();
    let isOpen;
    let openingTimesMessage;

    if (openingTimes) {
      const openingTimesMoment =
        new OpeningTimes(
          item.openingTimes.general,
          'Europe/London',
          item.openingTimes.alterations);

      const status = openingTimesMoment.getStatus(now, { next: true });
      openingTimesMessage = getOpeningHoursMessage(status);
      isOpen = status.isOpen;
    } else {
      openingTimesMessage = 'Call for opening times';
      isOpen = false;
    }

    item.openingTimesMessage = openingTimesMessage;
    item.isOpen = isOpen;

    if (isOpen && openServiceCount < numberOfOpenToReturn) {
      openServiceCount++;
      openServices.push(utils.deepClone(item));
    }

    serviceCount++;

    if (openServiceCount >= numberOfOpenToReturn && serviceCount >= limits.nearby) {
      break;
    }
  }
  log.debug('filter-open-results-end');

  return {
    nearbyServices: sortedOrgs,
    openServices,
  };
}

function nearby(searchPoint, geo, searchLimits) {
  assert(searchPoint, 'searchPoint can not be null');
  assert.equal(typeof (searchPoint.latitude), 'number',
      'searchPoint must contain a property named latitude');
  assert.equal(typeof (searchPoint.longitude), 'number',
      'searchPoint must contain a property named longitude');

  assert(geo, 'geo can not be null');
  assert.equal(typeof (geo.nearBy), 'function', 'geo must contain a nearBy function');

  const defaultNearbyLimit = 10;
  const defaultOpenLimit = 3;

  const limits = searchLimits || {};
  limits.nearby = limits.nearby || defaultNearbyLimit;
  limits.open = limits.open || defaultOpenLimit;

  let openServices = [];
  let nearbyServices = [];

  const searchRing = {
    start: 0,
    end: 10,
    increment: 10,
  };

  let loopCount = 0;
  const idProperty = 'identifier';

  while (openServices.length < limits.open + 1
    && nearbyServices.length < limits.nearby + 1) {
    log.info(`nearby-ring-search-start-#${loopCount + 1}`);
    const ringSearchResults = nearbyRingSearch(searchPoint, geo, limits, searchRing);
    log.info(`nearby-ring-search-end-#${loopCount + 1}`);

    openServices =
        utils.removeDuplicates(
          openServices.concat(
            ringSearchResults.openServices), idProperty);
    nearbyServices =
        utils.removeDuplicates(
          nearbyServices.concat(
            ringSearchResults.nearbyServices), idProperty);

    searchRing.start += searchRing.increment;
    searchRing.end += searchRing.increment;

    loopCount++;
    if (loopCount > 10) {
      // stop searching after 10 ring searches
      break;
    }
  }

  return {
    openServices: openServices.sort(sortByDistance).slice(0, limits.open),
    nearbyServices: nearbyServices.sort(sortByDistance).slice(0, limits.nearby),
  };
}

module.exports = {
  nearby,
};
