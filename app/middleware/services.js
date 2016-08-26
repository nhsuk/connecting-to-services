// eslint - disabled no-param-reassign since assigning to request/response
// is recommended best practice by Express

const http = require('http');
const dateUtils = require('../lib/dateUtils');
const openingTimesParser = require('../lib/openingTimesParser');
const pharmaciesParser = require('../lib/pharmaciesParser');
const pharmacyMapper = require('../lib/pharmacyMapper');
const daysOfTheWeek = require('../lib/constants').daysOfTheWeek;
const Verror = require('verror');
const googleMapsClient = require('@google/maps').createClient({
  key: '',
});

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

    getSyndicationResponse(
      `http://v1.syndication.nhschoices.nhs.uk/organisations/pharmacies/${pharmacyId}/overview.xml?apikey=${process.env.NHSCHOICES_SYNDICATION_APIKEY}`,
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
  const path = req.path.substring(1);
  res.render(path, {
    daysOfTheWeek,
    location: req.query.location,
    serviceList: req.serviceList,
    currentDateTime: dateUtils.nowForDisplay(),
  });
}

function getPharmacyUrl(req, res, next) {
  const location = req.query.location;
  const syndicationApiKey = process.env.NHSCHOICES_SYNDICATION_APIKEY;
  const requestUrl = `http://v1.syndication.nhschoices.nhs.uk/organisations/pharmacies/postcode/${location}.xml?range=50&apikey=${syndicationApiKey}`;

  // eslint-disable-next-line no-param-reassign
  req.urlForPharmacy = requestUrl;
  next();
}

function sortByDistance(a, b) {
  return a.distanceInKms - b.distanceInKms;
}

function prepareForRender(req, res, next) {
  const serviceList = pharmacyMapper(req.pharmacyList);
  const location = req.query.location;
  const start = `saddr=${location}`;

  serviceList.forEach((item) => {
    // eslint-disable-next-line no-param-reassign
    item.distanceInMiles = item.distanceInKms / 1.6;
    if (item.addressLine) {
      if (item.postcode) {
        item.addressLine.push(item.postcode);
      }
    }
    // eslint-disable-next-line prefer-spread
    const fullAddress = `${item.name},${item.addressLine}`.replace(/ /g, '+');
    const destination = `daddr=${fullAddress}`;
    // Use near to help get the correct location for the start
    const near = `near=${fullAddress}`;
    // eslint-disable-next-line no-param-reassign
    item.googleMapsQuery = `${start}&${destination}&${near}`;
  });
  // eslint-disable-next-line no-param-reassign
  req.serviceList = serviceList.sort(sortByDistance);
  next();
}

function prepareOpenThingsForRender(req, res, next) {
  // Only get the 2 closet OPEN pharmacies
  const serviceLimit = 2;
  const serviceList = pharmacyMapper(req.pharmacyList)
        .sort((p1, p2) => parseInt(p1.distanceInKms, 10) - parseInt(p2.distanceInKms, 10))
        .filter((pharmacy) => pharmacy.openNow)
        .slice(0, serviceLimit);
    // [TODO] Used to get all of the pharmacies - different from other method...
    // mappedPharmacies = pharmacyMapper(req.pharmacyList)
        // .sort((p1, p2) => parseInt(p1.distanceInKms, 10) - parseInt(p2.distanceInKms, 10))
        // .slice(0, serviceLimit);
  const location = req.query.location;
  const start = `saddr=${location}`;

  serviceList.forEach((item) => {
    // eslint-disable-next-line no-param-reassign
    item.distanceInMiles = item.distanceInKms / 1.6;
    if (item.addressLine) {
      if (item.postcode) {
        item.addressLine.push(item.postcode);
      }
    }
    // eslint-disable-next-line prefer-spread
    const fullAddress = `${item.name},${item.addressLine}`.replace(/ /g, '+');
    const destination = `daddr=${fullAddress}`;
    // Use near to help get the correct location for the start
    const near = `near=${fullAddress}`;
    // eslint-disable-next-line no-param-reassign
    item.googleMapsQuery = `${start}&${destination}&${near}`;
  });
  // eslint-disable-next-line no-param-reassign
  req.serviceList = serviceList.sort(sortByDistance);
  next();
}

function getGoogleMapsInfo(req, res, next) {
  const services = req.serviceList;
  const location = req.query.location;

  // for each service get the address and add them to the query
  const destinations = [];
  const origins = [];
  services.forEach((service) => {
    destinations.push(`${service.name},${service.addressLine}`.replace(/ /g, '+'));
    origins.push(location);
  });

  googleMapsClient.distanceMatrix({
    origins: location,
    destinations,
    // mode: 'transit',
    units: 'imperial',
  }, (err, response) => {
    if (!err) {
      // console.log('MAPS Response:');
      console.log(response.json);
      const rows = response.json.rows;
      rows.forEach((row) => {
        console.log('ROW:');
        console.log(row);
      });
      // There are as many rows as there are origins
      const originRow = response.json.rows[0];
      // As many elements as there are destinations
      // Which is just the one right now, needs to change
      // to request for all X result item destinations
      // in a single go
      const elements = originRow.elements;
      elements.forEach((element, index) => {
        console.log(element);
        console.log(index);
        if (element.status === 'OK') {
          services[index].distance = element.distance.text;
          services[index].duration = element.duration.text;
        }
      });
      next();
    } else {
      console.log(err);
    }
  });
}

module.exports = {
  getPharmacyUrl,
  getPharmacies,
  getPharmacyOpeningTimes,
  getGoogleMapsInfo,
  renderServiceResults,
  prepareForRender,
  prepareOpenThingsForRender,
};
