const chai = require('chai');
const getSearchType = require('../../../app/lib/getSearchType');
const constants = require('../../../app/lib/constants');

const { expect } = chai;
const noCoordinates = {};
const validCoordinates = { latitude: 0.1, longitude: -0.5 };

describe('get search type', () => {
  it('should return postcodeSearch when location is a postcode', () => {
    const type = getSearchType('LS1', noCoordinates);
    expect(type).to.equal(constants.postcodeSearch);
  });

  it('should return placeSearch when location is not a postcode', () => {
    const type = getSearchType('Leeds', noCoordinates);
    expect(type).to.equal(constants.placeSearch);
  });

  it('should return placeSearch when location contains postcode and coordinates, i.e. from the disambiguation page', () => {
    const type = getSearchType('Leeds LS1', validCoordinates);
    expect(type).to.equal(constants.placeSearch);
  });

  it('should return yourLocationSearch when location is \'your Location\' and valid coordinates', () => {
    const type = getSearchType(constants.yourLocation, validCoordinates);
    expect(type).to.equal(constants.yourLocationSearch);
  });

  it('should return yourLocationSearch when location is \'your Location\' and no coordinates', () => {
    const type = getSearchType(constants.yourLocation, noCoordinates);
    expect(type).to.equal(constants.yourLocationSearch);
  });
});
