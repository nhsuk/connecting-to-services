const log = require('../../app/lib/logger');
const OpeningTimes = require('moment-opening-times');
const moment = require('moment');
const geolib = require('geolib');
const assert = require('assert');
const utils = require('../lib/utils');

const metersInAMile = 1609;

function getOpeningHoursMessage(status) {
  if (status.isOpen) {
    const closedNext = status.until;
    const closedTime = closedNext.format('h:mm a');
    const closedDay = closedNext.calendar(status.moment, {
      sameDay: '[today]',
      nextDay: '[tomorrow]',
      nextWeek: 'dddd',
      lastDay: '[yesterday]',
      lastWeek: '[last] dddd',
      sameElse: 'DD/MM/YYYY',
    });
    return (
      ((closedDay === 'tomorrow' && closedTime === '12:00 am')
        || (closedDay === 'today' && closedTime === '11:59 pm')) ?
        'Open until midnight' :
        `Open until ${closedTime} ${closedDay}`);
  }
  const openNext = status.until;
  if (!openNext) {
    return 'Call for opening times.';
  }
  const timeUntilOpen = openNext.diff(status.moment, 'minutes');
  const openDay = openNext.calendar(status.moment, {
    sameDay: '[today]',
    nextDay: '[tomorrow]',
    nextWeek: 'dddd',
    lastDay: '[yesterday]',
    lastWeek: '[last] dddd',
    sameElse: 'DD/MM/YYYY',
  });
  return (
    (timeUntilOpen <= 60) ?
      `Opening in ${timeUntilOpen} minutes` :
      `Closed until ${openNext.format('h:mm a')} ${openDay}`);
}

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

  log.debug('get-nearby-results-start');
  const nearbyGeo =
    geo.nearBy(searchPoint.latitude, searchPoint.longitude, 50 * metersInAMile);
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

      const status = openingTimesMoment.getStatus(now);
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

    if (openServiceCount >= numberOfOpenToReturn && serviceCount >= maxResults) {
      break;
    }
  }
  log.debug('filter-open-results-end');

  return {
    nearbyServices: sortedOrgs.slice(0, maxResults),
    openServices,
  };
}

module.exports = {
  nearby,
};
