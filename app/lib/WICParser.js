const xml2js = require('xml2js');
const stripPrefix = require('xml2js/lib/processors').stripPrefix;
const assert = require('assert');
const Verror = require('verror');

const parseList = (xml) => {
  assert(xml, 'parameter \'xml\' undefined/empty');
  assert.equal(typeof(xml),
    'string', 'parameter \'xml\' must be a string');
  let wicList;
  const options = {
    tagNameProcessors: [stripPrefix],
    ignoreAttrs: true,
    explicitArray: false,
  };
  const xmlParser = new xml2js.Parser(options);
  xmlParser.parseString(xml, (err, result) => {
    if (err) {
      throw new Verror(err, 'Unable to parse WIC XML');
    }
    wicList = result.feed.entry;
  });
  return wicList.slice(0, 5);
};

function parseOne(xml) {
  let wic;
  const options = {
    tagNameProcessors: [stripPrefix],
    ignoreAttrs: true,
    explicitArray: false,
  };
  const xmlParser = new xml2js.Parser(options);
  xmlParser.parseString(xml, (err, result) => {
    if (err) {
      throw new Verror(err, 'Unable to parse individual WIC XML');
    }
    wic = result.feed.entry;
  });
  return wic;
}

module.exports = {
  parseList,
  parseOne,
};
