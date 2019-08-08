const moment = require('moment');
const VError = require('verror').VError;
const queryTypes = require('./constants').queryTypes;
const getDateTime = require('../lib/getDateTime');

const pharmacyFilter = 'OrganisationTypeID eq \'PHA\'';

function getOpenPharmacyFilter(date) {
  const aMoment = moment(date);
  const weekday = aMoment.format('dddd');
  const offsetTime = (aMoment.hours() * 60) + aMoment.minutes();
  const dateString = aMoment.format('MMM D YYYY');

  const openPharmacyFilter = `
  ${pharmacyFilter} and
  ( OpeningTimesV2/any(time:
          time/IsOpen
          and time/Weekday eq '${weekday}'
          and time/OpeningTimeType eq 'General'
          and time/OffsetOpeningTime le ${offsetTime}
          and time/OffsetClosingTime ge ${offsetTime})
      and not OpeningTimesV2/any(time:
              time/OpeningTimeType eq 'Additional'
              and time/AdditionalOpeningDate eq '${dateString}')
      ) or (
        OpeningTimesV2/any(time:
                time/IsOpen
                and time/OpeningTimeType eq 'Additional'
                and time/OffsetOpeningTime le ${offsetTime}
                and time/OffsetClosingTime ge ${offsetTime}
                and time/AdditionalOpeningDate eq '${dateString}')
      )`;

  // the formatting above is useful for legibility but not needed by AS
  return openPharmacyFilter.replace(/\s+/g, ' ');
}

function build(searchOrigin, options) {
  let filter;

  switch (options.queryType) {
    case queryTypes.nearby:
      filter = pharmacyFilter;
      break;
    case queryTypes.openNearby:
      filter = getOpenPharmacyFilter(getDateTime());
      break;
    default:
      throw new VError(`Unknown queryType: ${options.queryType}`);
  }

  const query = {
    count: true,
    filter,
    orderby: `geo.distance(Geocode, geography'POINT(${searchOrigin.longitude} ${searchOrigin.latitude})')`,
    select: 'NACSCode, OrganisationName, Address1, Address2, Address3, City, County, Postcode, Geocode, Contacts, OpeningTimes, OpeningTimesV2',
    top: options.size || 10,
  };

  return query;
}

module.exports = build;
