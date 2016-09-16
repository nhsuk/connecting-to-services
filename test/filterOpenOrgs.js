const chai = require('chai');
const filterOpenOrgs = require('../middleware/filterOpenOrgs');

const expect = chai.expect;

describe('filterOpenOrgs', () => {
  it('should create a property of only orgs that are open', () => {
    const openAllDay = {
      monday: { times: [{ fromTime: '00:00', toTime: '23:59' }] },
      tuesday: { times: [{ fromTime: '00:00', toTime: '23:59' }] },
      wednesday: { times: [{ fromTime: '00:00', toTime: '23:59' }] },
      thursday: { times: [{ fromTime: '00:00', toTime: '23:59' }] },
      friday: { times: [{ fromTime: '00:00', toTime: '23:59' }] },
      saturday: { times: [{ fromTime: '00:00', toTime: '23:59' }] },
      sunday: { times: [{ fromTime: '00:00', toTime: '23:59' }] },
    };
    const closedAllDay = {
      monday: { times: ['Closed'] },
      tuesday: { times: ['Closed'] },
      wednesday: { times: ['Closed'] },
      thursday: { times: ['Closed'] },
      friday: { times: ['Closed'] },
      saturday: { times: ['Closed'] },
      sunday: { times: ['Closed'] },
    };

    const req = { results: [
      { openingTimes: openAllDay },
      { openingTimes: closedAllDay },
      { openingTimes: openAllDay },
    ] };

    filterOpenOrgs(req, null, () => {});

    // eslint-disable-next-line no-unused-expressions
    expect(req.openResults).is.not.null;
    expect(req.openResults.length).is.equal(2);
  });
});
