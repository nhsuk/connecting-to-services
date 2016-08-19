// eslint - disabled no-param-reassign since assigning to request/response
// is recommended best practice by Express

const http = require('http');
const dateUtils = require('../lib/dateUtils');
const openingTimesParser = require('../lib/openingTimesParser');
const pharmaciesParser = require('../lib/pharmaciesParser');
const wicParser = require('../lib/WICParser');
const pharmacyMapper = require('../lib/pharmacyMapper');
const wicMapper = require('../lib/wicMapper');
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

function getWICs(req, res, next) {
  getSyndicationResponse(
    req.urlForWIC,
    'WIC List',
    (syndicationXml) => {
      // eslint-disable-next-line no-param-reassign
      req.wicList = wicParser.parseList(syndicationXml);
    },
    next
  );
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

function getWICDetails(req, res, next) {
  let wicCount = req.wicList.length;

  req.wicList.forEach((wic) => {
    const wicId = wic.id;
    const wicUrl = `${wicId}.xml?apikey=${process.env.NHSCHOICES_SYNDICATION_APIKEY}`;

    getSyndicationResponse(
      wicUrl,
      'wic details',
      (syndicationXml) => {
        try {
          /* eslint-disable no-param-reassign */
          const parsedWic = wicParser.parseOne(syndicationXml);
          wic.address = parsedWic.content.service.address.addressLine;
          wic.postcode = parsedWic.content.service.address.postcode;
          wic.telephone = parsedWic.content.service.phone;
          wic.coords = {
            latitude: parsedWic.content.service.geographicCoordinates.latitude,
            longitude: parsedWic.content.service.geographicCoordinates.longitude,
          };
          /* eslint-enable no-param-reassign */
        } catch (e) {
          // intentionally left empty to allow WICs without the things being
          // mapped above to get through to the results page
          console.error(e);
        }
      },
      () => {
        wicCount--;
        if (wicCount === 0) {
          next();
        }
      }
    );
  });
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

function getWICUrl(req, res, next) {
  const location = req.query.location;
  const syndicationApiKey = process.env.NHSCHOICES_SYNDICATION_APIKEY;
  const requestUrl = `http://v1.syndication.nhschoices.nhs.uk/services/types/srv0183/postcode/${location}.xml?apikey=${syndicationApiKey}&range=100`;

  // eslint-disable-next-line no-param-reassign
  req.urlForWIC = requestUrl;
  next();
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

function prepareOpenThingsForRender(req, res, next) {
  // just get open things
  const mappedPharmacies = pharmacyMapper(req.pharmacyList);
  const mappedWics = wicMapper(req.wicList);
  const serviceList = mappedPharmacies.concat(mappedWics);
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

function prepareForRender(req, res, next) {
  const serviceLimit = 3;
  let mappedPharmacies;
  if (req.query.status === 'open') {
    mappedPharmacies =
      pharmacyMapper(req.pharmacyList)
        .sort((p1, p2) => parseInt(p1.distanceInKms, 10) - parseInt(p2.distanceInKms, 10))
        .filter((pharmacy) => pharmacy.openNow)
        .slice(0, serviceLimit);
  } else {
    // Alternative would be to only get 1 page of postcode results when not
    // filtering by open status
    mappedPharmacies = pharmacyMapper(req.pharmacyList)
        .sort((p1, p2) => parseInt(p1.distanceInKms, 10) - parseInt(p2.distanceInKms, 10))
        .slice(0, serviceLimit);
  }
  const mappedWics = wicMapper(req.wicList.slice(0, serviceLimit));
  const serviceList = mappedPharmacies.concat(mappedWics);
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
  getWICUrl,
  getPharmacies,
  getWICs,
  getPharmacyOpeningTimes,
  getWICDetails,
  getGoogleMapsInfo,
  renderServiceResults,
  prepareForRender,
  prepareOpenThingsForRender,
};
