const moment = require('moment-timezone');
const chai = require('chai');

const azMapper = require('../../../../app/lib/mappers/azMapper');
const utils = require('../../../../app/lib/utils');
const asSampleResponse = require('../../../resources/organisations/FK276-as');
const esSampleResponse = require('../../../resources/organisations/FK276-es');

const { expect } = chai;

function removePastAdditionalDates(esSampleResponseOriginal) {
  // this needs doing since Azure Search does not return past additional dates whilst
  // Elastic Search did
  // It should make no functional difference to the behaviour
  const esSampleResponseCopy = utils.deepClone(esSampleResponseOriginal);
  const alterationDates = Object.keys(esSampleResponseCopy.openingTimes.alterations);
  alterationDates.forEach((ad) => {
    if (moment(ad).isBefore('2019-07-31')) {
      delete esSampleResponseCopy.openingTimes.alterations[ad];
    }
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
    const datetime = moment.tz('2019-08-02 07:30', 'Europe/London');
    result = azMapper(asSampleResponse, origin, datetime);
  });
  it('no new keys should be introduced (but some may be not added)', async () => {
    expect(esSampleResponse).to.include.all.keys(result);
  });
  it('should map top level properties corrrectly from Azure Search format to Elastic Search format', async () => {
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
  it('should map opening times corrrectly from Azure Search format to Elastic Search format', async () => {
    const expectedProperties = [
      'openingTimes',
    ];
    const esSampleResponseCopy = removePastAdditionalDates(esSampleResponse);

    expectedProperties.forEach((propertyName) => {
      assertPropertyMapping(result, esSampleResponseCopy, propertyName);
    });
  });
  it('should map required contact properties corrrectly from Azure Search format to Elastic Search format', async () => {
    const expectedProperties = [
      'email',
      'telephone',
      'website',
      'fax',
    ];
    expectedProperties.forEach((propertyName) => {
      assertPropertyMapping(result.contacts, esSampleResponse.contacts, propertyName, true);
    });
  });
});
