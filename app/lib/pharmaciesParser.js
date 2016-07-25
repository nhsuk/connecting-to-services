const xml2js = require('xml2js');
const stripPrefix = require('xml2js/lib/processors').stripPrefix;
const assert = require('assert');
const Verror = require('verror');

function convertKmsToMiles(pharmacies) {
  pharmacies.forEach((pharmacy) => {
    const distanceInKms = pharmacy.content.organisationSummary.Distance;
    const distanceInMiles = distanceInKms / 1.6;
    // eslint-disable-next-line no-param-reassign
    pharmacy.content.organisationSummary.Distance = distanceInMiles;
  });
}

const parsePharmacyListFromSyndicationXml = (xml) => {
  assert(xml, 'parameter \'xml\' undefined/empty');
  assert.equal(typeof(xml),
    'string', 'parameter \'xml\' must be a string');
  let pharmacyList;
  const options = {
    tagNameProcessors: [stripPrefix],
    ignoreAttrs: true,
    explicitArray: false,
  };
  const xmlParser = new xml2js.Parser(options);
  xmlParser.parseString(xml, (err, result) => {
    if (err) {
      throw new Verror(err, 'Unable to parse Pharmacy XML');
    }
    pharmacyList = result.feed.entry;
  });
  const firstPharmacies = pharmacyList.slice(0, 5);
  convertKmsToMiles(firstPharmacies);
  return firstPharmacies;
};

module.exports = parsePharmacyListFromSyndicationXml;
