const xml2js = require('xml2js');
const jsonQuery = require('json-query');
const stripPrefix = require('xml2js/lib/processors').stripPrefix;
const assert = require('assert');
const Verror = require('verror');

const parseGpDetailsFromSyndicationXml = (xml) => {
  assert.ok(xml, 'parameter \'xml\' undefined/empty');
  assert.equal(typeof(xml),
    'string', 'parameter \'xml\' must be a string');
  let gpDetails;
  const options = {
    tagNameProcessors: [stripPrefix],
    ignoreAttrs: true,
    explicitArray: false,
  };
  const xmlParser = new xml2js.Parser(options);
  xmlParser.parseString(xml, (err, result) => {
    if (err) {
      throw new Verror(err, 'Unable to parse GP XML');
    }
    assert.ok(result.Organisation, 'Organisation not found.');
    assert.ok(result.Organisation.Address, 'Organisation address not found.');

    const overviewLink = jsonQuery('Organisation.ProfileLinks.Link[Text=Overview].Uri', {
      data: result,
    }).value;

    assert.ok(overviewLink, 'Organisation overview link not found.');

    gpDetails = {
      name: result.Organisation.Name,
      address: {
        line1: result.Organisation.Address.Line1,
        line2: result.Organisation.Address.Line2,
        line3: result.Organisation.Address.Line3,
        line4: result.Organisation.Address.Line4,
        postcode: result.Organisation.Address.Postcode,
      },
      // TODO: find a better method which doesn't rely on a string match
      overviewLink: overviewLink.replace('overview', 'overview.xml'),
    };
  });
  return gpDetails;
};

module.exports = parseGpDetailsFromSyndicationXml;
