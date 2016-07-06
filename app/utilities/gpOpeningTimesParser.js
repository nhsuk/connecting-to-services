const xml2js = require('xml2js');
const jsonQuery = require('json-query');
const stripPrefix = require('./processors').stripPrefix;

const parseGpOpeningTimesFromSyndicationXml = (openingTimesType, xml) => {
  const gpOpeningTimes = {};
  const options = {
    tagNameProcessors: [stripPrefix],
    explicitArray: false,
  };
  const xmlParser = new xml2js.Parser(options);
  xmlParser.parseString(xml, (err, result) => {
    const openingTimes = result.feed.entry.content.overview.openingTimes.timesSessionTypes;
    const receptionOpeningTimes = jsonQuery('timesSessionType[*:isType]', {
      data: openingTimes,
      locals: {
        isType: (item) => item.$.sessionType === openingTimesType,
      },
    }).value[0];

    receptionOpeningTimes.daysOfWeek.dayOfWeek.forEach((item) => {
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
  });
  return gpOpeningTimes;
};

module.exports = parseGpOpeningTimesFromSyndicationXml;
