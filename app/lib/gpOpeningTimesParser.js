const xml2js = require('xml2js');
const jsonQuery = require('json-query');
const stripPrefix = require('xml2js/lib/processors').stripPrefix;
const assert = require('assert');
const Verror = require('verror');

const parseGpOpeningTimesFromSyndicationXml = (openingTimesType, xml) => {
  assert.ok(openingTimesType, 'parameter \'openingTimesType\' undefined/empty');
  assert.ok(xml, 'parameter \'xml\' undefined/empty');
  assert.equal(typeof(openingTimesType),
    'string', 'parameter \'openingTimesType\' must be a string');
  assert.equal(typeof(xml),
    'string', 'parameter \'xml\' must be a string');
  const gpOpeningTimes = {};
  const options = {
    tagNameProcessors: [stripPrefix],
    explicitArray: false,
  };
  const xmlParser = new xml2js.Parser(options);
  xmlParser.parseString(xml, (err, result) => {
    if (err) {
      throw new Verror(err, 'Unable to parse GP opening times XML');
    }

    let openingTimesForType = null;
    try {
      const openingTimes = result.feed.entry.content.overview.openingTimes.timesSessionTypes;
      openingTimesForType = jsonQuery('timesSessionType[*:isType]', {
        data: openingTimes,
        locals: {
          isType: (item) => item.$.sessionType === openingTimesType,
        },
      }).value[0];

      openingTimesForType.daysOfWeek.dayOfWeek.forEach((item) => {
        const dayName = item.dayName.toLowerCase();
        gpOpeningTimes[dayName] = {};
        const session = item.timesSessions.timesSession;
        gpOpeningTimes[dayName] = {
          times: [],
        };
        if (Array.isArray(session)) {
          session.forEach((s) => {
            gpOpeningTimes[dayName].times.push(s);
          });
        } else {
          gpOpeningTimes[dayName].times.push(session);
        }
      });
    } catch (e) {
      throw new Verror(e, `Unable to get '${openingTimesType}' opening times from xml`);
    }
  });
  return gpOpeningTimes;
};

module.exports = parseGpOpeningTimesFromSyndicationXml;
