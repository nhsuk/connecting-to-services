const xml2js = require('xml2js');
const jsonQuery = require('json-query');
const stripPrefix = require('xml2js/lib/processors').stripPrefix;
const assert = require('assert');
const Verror = require('verror');

function parseOverview(xml) {
  assert(xml, 'parameter \'xml\' undefined/empty');
  const org = {};
  const openingTimes = {};
  const options = {
    tagNameProcessors: [stripPrefix],
  };
  const xmlParser = new xml2js.Parser(options);
  xmlParser.parseString(xml, (err, result) => {
    if (err) {
      throw new Verror(err, 'Unable to parse overview XML');
    }

    let openingTimesForType = null;
    try {
      const allOpeningTimes =
        result.feed.entry[0].content[0].overview[0].openingTimes[0].timesSessionTypes[0];

      openingTimesForType = jsonQuery('timesSessionType[*:isType]', {
        data: allOpeningTimes,
        locals: {
          isType: item => item.$.sessionType === 'general',
        },
      }).value[0];

      openingTimesForType.daysOfWeek[0].dayOfWeek.forEach((item) => {
        const dayName = item.dayName[0].toLowerCase();
        openingTimes[dayName] = {};
        openingTimes[dayName] = {
          times: [],
        };
        item.timesSessions[0].timesSession.forEach((t) => {
          if (t.fromTime) {
            // session details are a time range
            openingTimes[dayName].times.push({ fromTime: t.fromTime[0], toTime: t.toTime[0] });
          } else {
            // session details are text (e.g. closed)
            openingTimes[dayName].times.push(t);
          }
        });
      });
    } catch (e) {
      throw new Verror(e, 'Unable to get general opening times from xml');
    }
  });
  org.openingTimes = openingTimes;
  return org;
}

module.exports = parseOverview;
