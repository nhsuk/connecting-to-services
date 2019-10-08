/* eslint-disable sort-keys */
const chai = require('chai');
const moment = require('moment');

const azOpeningTimesMapper = require('../../../../app/lib/mappers/azOpeningTimesMapper');

const { expect } = chai;

const daysOfWeek = moment.weekdays().map((wd) => wd.toLowerCase());

const generalOpeningTimes = [
  {
    Weekday: 'Monday',
    Times: '10:00-13:00',
    OffsetOpeningTime: null,
    OffsetClosingTime: null,
    OpeningTimeType: 'General',
    AdditionalOpeningDate: '',
    IsOpen: true,
  },
  {
    Weekday: 'Monday',
    Times: '13:30-16:00',
    OffsetOpeningTime: null,
    OffsetClosingTime: null,
    OpeningTimeType: 'General',
    AdditionalOpeningDate: '',
    IsOpen: true,
  },
];
const additionalClosedTimes = [
  {
    Weekday: '',
    Times: '',
    OffsetOpeningTime: null,
    OffsetClosingTime: null,
    OpeningTimeType: 'General',
    AdditionalOpeningDate: 'Aug 26 2019',
    IsOpen: false,
  },
  {
    Weekday: '',
    Times: '',
    OffsetOpeningTime: null,
    OffsetClosingTime: null,
    OpeningTimeType: 'General',
    AdditionalOpeningDate: 'Dec 25 2019',
    IsOpen: false,
  },
];
const additionalOpeningTimes = [
  {
    Weekday: '',
    Times: '10:00-13:00',
    OffsetOpeningTime: null,
    OffsetClosingTime: null,
    OpeningTimeType: 'General',
    AdditionalOpeningDate: 'Aug 26 2019',
    IsOpen: true,
  },
  {
    Weekday: '',
    Times: '13:30-16:00',
    OffsetOpeningTime: null,
    OffsetClosingTime: null,
    OpeningTimeType: 'General',
    AdditionalOpeningDate: 'Aug 26 2019',
    IsOpen: true,
  },
];

describe('azOpeningTimesMapper', () => {
  it('Empty opening times should return an empty opening times object', () => {
    const esOpeningTimes = azOpeningTimesMapper([]);
    expect(esOpeningTimes.general).to.have.keys(daysOfWeek);
    daysOfWeek.forEach((dow) => expect(esOpeningTimes.general[dow]).to.eql([]));
    expect(esOpeningTimes.alterations).to.eql({});
  });
  it('General opening times should map correctly', () => {
    const esOpeningTimes = azOpeningTimesMapper(generalOpeningTimes);
    expect(esOpeningTimes.general.monday.length).to.equal(2);
    expect(esOpeningTimes.general.monday[0]).to.eql({ opens: '10:00', closes: '13:00' });
    expect(esOpeningTimes.general.monday[1]).to.eql({ opens: '13:30', closes: '16:00' });
    daysOfWeek.filter((dow) => dow !== 'monday').forEach((dow) => expect(esOpeningTimes.general[dow]).to.eql([]));
  });
  it('Additional closing times should map correctly', () => {
    const esOpeningTimes = azOpeningTimesMapper(additionalClosedTimes);
    expect(esOpeningTimes.alterations).to.have.keys(['2019-08-26', '2019-12-25']);
    expect(esOpeningTimes.alterations['2019-08-26']).to.eql([]);
    daysOfWeek.forEach((dow) => expect(esOpeningTimes.general[dow]).to.eql([]));
  });
  it('Additional opening times should map correctly', () => {
    const esOpeningTimes = azOpeningTimesMapper(additionalOpeningTimes);
    expect(esOpeningTimes.alterations).to.have.keys(['2019-08-26']);
    expect(esOpeningTimes.alterations['2019-08-26']).to.eql([
      { opens: '10:00', closes: '13:00' },
      { opens: '13:30', closes: '16:00' },
    ]);
    daysOfWeek.forEach((dow) => expect(esOpeningTimes.general[dow]).to.eql([]));
  });
  it('opening times with both general and additional opening times should map correctly', () => {
    const combinedOpeningTimes = generalOpeningTimes.concat(additionalOpeningTimes);
    const esOpeningTimes = azOpeningTimesMapper(combinedOpeningTimes);
    expect(esOpeningTimes.alterations).to.have.keys(['2019-08-26']);
    expect(esOpeningTimes.alterations['2019-08-26']).to.eql([
      { opens: '10:00', closes: '13:00' },
      { opens: '13:30', closes: '16:00' },
    ]);
    expect(esOpeningTimes.general.monday.length).to.equal(2);
    expect(esOpeningTimes.general.monday[0]).to.eql({ opens: '10:00', closes: '13:00' });
    expect(esOpeningTimes.general.monday[1]).to.eql({ opens: '13:30', closes: '16:00' });
    daysOfWeek.filter((dow) => dow !== 'monday').forEach((dow) => expect(esOpeningTimes.general[dow]).to.eql([]));
  });
  it('opening times with both general opening times and additional closing times should map correctly', () => {
    const combinedOpeningTimes = generalOpeningTimes.concat(additionalClosedTimes);
    const esOpeningTimes = azOpeningTimesMapper(combinedOpeningTimes);
    expect(esOpeningTimes.alterations).to.have.keys(['2019-08-26', '2019-12-25']);
    expect(esOpeningTimes.alterations['2019-08-26']).to.eql([]);
    expect(esOpeningTimes.general.monday.length).to.equal(2);
    expect(esOpeningTimes.general.monday[0]).to.eql({ opens: '10:00', closes: '13:00' });
    expect(esOpeningTimes.general.monday[1]).to.eql({ opens: '13:30', closes: '16:00' });
    daysOfWeek.filter((dow) => dow !== 'monday').forEach((dow) => expect(esOpeningTimes.general[dow]).to.eql([]));
  });
});
