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
      Name: result.Organisation.Name,
      Address: {
        Line1: result.Organisation.Address.Line1,
        Line2: result.Organisation.Address.Line2,
        Line3: result.Organisation.Address.Line3,
        Line4: result.Organisation.Address.Line4,
        Postcode: result.Organisation.Address.Postcode,
      },
      OverviewLink: overviewLink,
    };
  });
  return gpDetails;
};

module.exports = parseGpDetailsFromSyndicationXml;
