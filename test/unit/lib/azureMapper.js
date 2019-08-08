const moment = require('moment-timezone');
const chai = require('chai');

const azMapper = require('../../../app/lib/azMapper');
const asSampleResponse = require('../../resources/organisations/FK276-as');
const esSampleResponse = require('../../resources/organisations/FK276-es');

const expect = chai.expect;

function removePastAdditionalDates(esSampleResponseOriginal) {
  // this needs doing since AS does not return past additional dates whilst ES did
  // it should make no functional difference to the behaviour
  const esSampleResponseCopy = JSON.parse(JSON.stringify(esSampleResponseOriginal));
  const dates = Object.keys(esSampleResponseCopy.openingTimes.alterations);
  const pastDates = dates.filter(d => moment(d).isBefore('2019-07-31'));
  pastDates.forEach((d) => {
    delete esSampleResponseCopy.openingTimes.alterations[d];
  });
  return esSampleResponseCopy;
}

function lowerCase(s) {
  return (typeof s === 'string') ? s.toLowerCase() : s;
}

function assertPropertyMapping(result, expectedResult, propertyName, ignoreCase) {
  if (ignoreCase) {
    expect(lowerCase(result[propertyName]), propertyName)
      .to.be.eql(lowerCase(expectedResult[propertyName]));
  } else {
    expect(result[propertyName], propertyName).to.be.eql(expectedResult[propertyName]);
  }
}

describe('azureMapper', () => {
  let result;
  beforeEach('setup', async () => {
    const origin = {
      latitude: 53.7975673878326,
      longitude: -1.55183371292776,
    };
    /* eslint-disable sort-keys */
    const datetime = moment.tz('2019-08-02 07:30', 'Europe/London');
    /* eslint-enable sort-keys */
    result = azMapper(asSampleResponse, origin, datetime);
  });
  it('no new keys should be introduced (but some may be not added)', async () => {
    expect(esSampleResponse).to.include.all.keys(result);
  });
  it('should map top level properties corrrectly from AS format to ES format', async () => {
    const expectedProperties = [
      'identifier',
      'name',
      'address',
    ];
    expectedProperties.forEach((propertyName) => {
      assertPropertyMapping(result, esSampleResponse, propertyName);
    });
  });
  it('should populate the distance', async () => {
    expect(result.distanceInMiles).to.be.gt(0);
  });
  it('should populate the opening times message', async () => {
    expect(result.openingTimesMessage).to.not.be.empty;
    assertPropertyMapping(result, esSampleResponse, 'openingTimesMessage');
  });
  it('should map opening times corrrectly from AS format to ES format', async () => {
    const expectedProperties = [
      'openingTimes',
    ];
    const esSampleResponseCopy = removePastAdditionalDates(esSampleResponse);

    expectedProperties.forEach((propertyName) => {
      assertPropertyMapping(result, esSampleResponseCopy, propertyName);
    });
  });
  it('should map required contact properties corrrectly from AS format to ES format', async () => {
    const expectedProperties = [
      'email',
      'telephoneNumber',
      'website',
      'fax',
    ];
    expectedProperties.forEach((propertyName) => {
      assertPropertyMapping(result.contacts, esSampleResponse.contacts, propertyName, true);
    });
  });
});
