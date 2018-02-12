const chai = require('chai');
const getSearchType = require('../../../app/lib/getSearchType');
const constants = require('../../../app/lib/constants');

const expect = chai.expect;

describe('get search type', () => {
  it('should return postcodeSearch when location is a postcode', () => {
    const noCoordinates = {};
    const type = getSearchType('LS1', noCoordinates);

    expect(type).to.equal(constants.postcodeSearch);
  });

  it('should return placeSearch when location is not a postcode', () => {
    const noCoordinates = {};
    const type = getSearchType('Leeds', noCoordinates);

    expect(type).to.equal(constants.placeSearch);
  });

  it('should return placeSearch when location contains postcode and coordinates, i.e. from the disambiguation page', () => {
    const coordinates = { latitude: 0.1, longitude: -0.5 };
    const type = getSearchType('Leeds LS1', coordinates);

    expect(type).to.equal(constants.placeSearch);
  });

  it('should return yourLocationSearch when location is \'your Location\'', () => {
    const coordinates = { latitude: 0.1, longitude: -0.5 };
    const type = getSearchType(constants.yourLocation, coordinates);

    expect(type).to.equal(constants.yourLocationSearch);
  });
});
