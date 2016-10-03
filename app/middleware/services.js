// eslint - disabled no-param-reassign since assigning to request/response
// is recommended best practice by Express

const http = require('http');
const moment = require('moment');
const openingTimesParser = require('../lib/openingTimesParser');
const pharmaciesParser = require('../lib/pharmaciesParser');
const pharmacyMapper = require('../lib/pharmacyMapper');
const Verror = require('verror');

function getSyndicationResponseHandler(resourceType, parser, next) {
  return (response) => {
    let syndicationXml = '';
    response.on('data', (chunk) => {
      syndicationXml += chunk;
    });

    response.on('end', () => {
      if (response.statusCode === 200) {
        parser(syndicationXml);
        next();
      } else if (response.statusCode === 404) {
        const err = new Verror(`${resourceType} Not Found`);
        err.statusCode = 404;
        next(err);
      } else {
        const err = new Verror('Syndication HTTP Error');
        err.statusCode = response.statusCode;
        next(err);
      }
    });
  };
}

function getSyndicationResponse(url, resourceType, parser, next) {
  http
    .get(url, getSyndicationResponseHandler(resourceType, parser, next))
    .on('error', (e) => {
      const err = new Verror(e, 'Syndication Server Error');
      err.statusCode = 500;
      next(err);
    });
}

function getPharmacies(req, res, next) {
  const pageCount = 10;
  let t = pageCount;
  let pharmacyList = [];

  const buildPharmacyList =
      (syndicationXml) => {
        pharmacyList = pharmacyList.concat(pharmaciesParser(syndicationXml));
      };
  const conditionalNext =
      (err) => {
        if (err) {
          console.log(err);
          next(err);
        }
        t--;
        if (t === 0) {
          // eslint-disable-next-line no-param-reassign
          req.pharmacyList = pharmacyList;
          next();
        }
      };

  for (let i = 1; i <= pageCount; i++) {
    getSyndicationResponse(
      `${req.urlForPharmacy}&page=${i}`,
      'Pharmacy List',
      buildPharmacyList,
      conditionalNext
    );
  }
}

function getPharmacyOpeningTimes(req, res, next) {
  let pharmacyCount = req.pharmacyList.length;
  req.pharmacyList.forEach((pharmacy) => {
    const pharmacyId = pharmacy.id.split('/').slice(-1)[0];

    // TODO: Only need to get opening times for the first 2 open pharmacies
    getSyndicationResponse(
      `${process.env.NHSCHOICES_SYNDICATION_BASEURL}/organisations/pharmacies/`
      + `${pharmacyId}/overview.xml`
      + `?apikey=${process.env.NHSCHOICES_SYNDICATION_APIKEY}`,
      'Pharmacy List',
      (syndicationXml) => {
        try {
          /* eslint-disable no-param-reassign */
          pharmacy.openingTimes = openingTimesParser('general', syndicationXml);
          /* eslint-enable no-param-reassign */
        } catch (e) {
          // intentionally left empty to allow pharmacies without any opening time
          // to be displayed without crashing the app
          console.log(e);
        }
      },
      () => {
        pharmacyCount--;
        if (pharmacyCount === 0) {
          next();
        }
      }
    );
  });
}

function renderServiceResults(req, res) {
  res.render('results');
}

function sortByDistanceInKms(a, b) {
  return a.distanceInKms - b.distanceInKms;
}

function sortByDistance(a, b) {
  return a.content.organisationSummary.Distance - b.content.organisationSummary.Distance;
}

function getDisplayValuesMapper(location) {
  const start = `saddr=${location}`;

  return (item) => {
    const fullAddress = `${item.name},${item.addressLine}`.replace(/ /g, '+');
    const destination = `daddr=${fullAddress}`;
    // Use near to help get the correct location for the start
    const near = `near=${fullAddress}`;

    const returnValue = {
      name: item.name,
      distanceInMiles: (item.distanceInKms / 1.6),
      googleMapsQuery: `${start}&${destination}&${near}`,
      openingTimesMessage: item.openingTimes ?
        item.openingTimes.getOpeningHoursMessage(moment()) :
        'Call for opening times',
      addressLine: item.addressLine,
      telephone: item.telephone,
    };
    if (returnValue.addressLine && item.postcode) {
      returnValue.addressLine.push(item.postcode);
    }

    return returnValue;
  };
}

function prepareForRender(req, res, next) {
  const open = req.query.open || false;
  const location = res.locals.location;
  let serviceList = [];
  let altResultsUrl = '';
  let altResultsMessage = '';

  if (open) {
    altResultsUrl = `/symptoms/stomach-ache/results?location=${location}`;
    altResultsMessage = 'See all nearby places that can help, open or closed';

    serviceList =
      pharmacyMapper(req.pharmacyList)
        .sort(sortByDistanceInKms)
        .filter((pharmacy) => (pharmacy.openingTimes ?
           pharmacy.openingTimes.isOpen(moment()) :
           false))
        .slice(0, 2)
        .map(getDisplayValuesMapper(location));
  } else {
    altResultsUrl = `/symptoms/stomach-ache/results?location=${location}&open=true`;
    altResultsMessage = 'See only open places nearby';

    const tenClosestPlaces = req.pharmacyList
          .sort(sortByDistance)
          .slice(0, 10);

    serviceList =
      pharmacyMapper(tenClosestPlaces)
        .map(getDisplayValuesMapper(location));
  }
  /* eslint-disable no-param-reassign */
  res.locals.serviceList = serviceList;
  res.locals.altResults = {};
  res.locals.altResults.url = altResultsUrl;
  res.locals.altResults.message = altResultsMessage;
  /* eslint-enable no-param-reassign */

  next();
}

module.exports = {
  getPharmacies,
  getPharmacyOpeningTimes,
  renderServiceResults,
  prepareForRender,
};
