/* eslint-disable sort-keys */
const chai = require('chai');
const formatOpeningTimes = require('../../../app/lib/formatOpeningTimes');

const expect = chai.expect;
const openingTimes = {
  general: {
    monday: [{ opens: '08:00', closes: '15:00' }, { opens: '16:00', closes: '17:00' }],
    tuesday: [{ opens: '09:00', closes: '15:00' }, { opens: '16:00', closes: '18:00' }],
    wednesday: [{ opens: '10:00', closes: '15:00' }, { opens: '16:00', closes: '19:00' }],
    thursday: [{ opens: '11:00', closes: '15:00' }, { opens: '16:00', closes: '20:00' }],
    friday: [{ opens: '12:00', closes: '15:00' }, { opens: '16:00', closes: '21:00' }],
    saturday: [{ opens: '13:00', closes: '15:00' }, { opens: '16:00', closes: '22:00' }],
    sunday: [{ opens: '14:00', closes: '15:00' }, { opens: '16:00', closes: '23:00' }],
  },
};

function assertDay(result, day, opens1, closes1, opens2, closes2) {
  expect(result.day).to.equal(day);
  expect(result.openingTimes).to.be.an('array');
  expect(result.openingTimes.length).to.equal(2);
  expect(result.openingTimes[0].opens).to.equal(opens1);
  expect(result.openingTimes[0].closes).to.equal(closes1);
  expect(result.openingTimes[1].opens).to.equal(opens2);
  expect(result.openingTimes[1].closes).to.equal(closes2);
}

describe('formatOpeningTimes', () => {
  it('should restrucure opening times as array, and format time', () => {
    const result = formatOpeningTimes(openingTimes);
    expect(result).to.be.an('array');
    assertDay(result[0], 'Monday', '8am', '3pm', '4pm', '5pm');
    assertDay(result[1], 'Tuesday', '9am', '3pm', '4pm', '6pm');
    assertDay(result[2], 'Wednesday', '10am', '3pm', '4pm', '7pm');
    assertDay(result[3], 'Thursday', '11am', '3pm', '4pm', '8pm');
    assertDay(result[4], 'Friday', '12pm', '3pm', '4pm', '9pm');
    assertDay(result[5], 'Saturday', '1pm', '3pm', '4pm', '10pm');
    assertDay(result[6], 'Sunday', '2pm', '3pm', '4pm', '11pm');
  });

  it('should return undefined opening times when closed all week', () => {
    const closedTimes = {
      general: {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: [],
      },
    };

    const result = formatOpeningTimes(closedTimes);
    expect(result).to.not.exist;
  });

  it('should return undefined opening times for day when sessions undefined', () => {
    const openingTimesWithMissing = {
      general: {
        monday: undefined,
        tuesday: [{ opens: '08:00', closes: '17:00' }],
      },
    };
    const result = formatOpeningTimes(openingTimesWithMissing);
    expect(result).to.exist;
    expect(result[0].day).to.equal('Monday');
    expect(result[0].openingTimes).to.not.exist;
  });

  it('should return defined openingTimes, but undefined opens and closes for a day that is closed, i.e empty array of sessions', () => {
    const openingTimesClosedTuesday = {
      general: {
        monday: [{ opens: '08:00', closes: '17:00' }],
        tuesday: [],
      },
    };
    const result = formatOpeningTimes(openingTimesClosedTuesday);
    expect(result).to.exist;
    expect(result[1].day).to.equal('Tuesday');
    expect(result[1].openingTimes).to.exist;
    expect(result[1].openingTimes.opens).to.not.exist;
    expect(result[1].openingTimes.closes).to.not.exist;
  });
});
/* eslint-enable sort-keys */
