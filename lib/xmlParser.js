const xml2js = require('xml2js');
const stripPrefix = require('xml2js/lib/processors').stripPrefix;
const Verror = require('verror');

function parse(xml) {
  let results = '';

  const options = {
    tagNameProcessors: [stripPrefix],
    explicitArray: false,
  };

  const xmlParser = new xml2js.Parser(options);
  xmlParser.parseString(xml, (err, result) => {
    if (err) {
      throw new Verror(err, 'Unable to parse XML');
    }
    results = result.feed.entry;
  });
  return results;
}

module.exports = parse;
