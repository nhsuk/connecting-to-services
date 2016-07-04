const xml2js = require('xml2js');
const jsonQuery = require('json-query');

function stripPrefix(name) {
  const prefixMatch = new RegExp(/(?!xmlns)^.*:/);
  return name.replace(prefixMatch, '');
}

const parseGpDetailsFromSyndicationXml = (xml) => {
  let gpDetails;
  const options = {
    tagNameProcessors: [stripPrefix],
    ignoreAttrs: true,
    explicitArray: false,
  };
  const xmlParser = new xml2js.Parser(options);
  xmlParser.parseString(xml, (err, result) => {
    // console.log(util.inspect(result, false, null));
    const overviewLink = jsonQuery('Organisation.ProfileLinks.Link[Text=Overview].Uri', {
      data: result,
    }).value;
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
