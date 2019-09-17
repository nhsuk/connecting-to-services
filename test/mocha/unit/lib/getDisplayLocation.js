const chai = require('chai');
const getDisplayLocation = require('../../../../app/lib/getDisplayLocation');

const expect = chai.expect;

describe('getDisplayLocation', () => {
  it('should gracefully handle undefined location', () => {
    const result = getDisplayLocation(undefined);
    expect(result).to.be.undefined;
  });

  it('should return text before the comma', () => {
    const result = getDisplayLocation('town, county, postcode');
    expect(result).to.equal('town');
  });

  it('should return entire string if no comma present', () => {
    const result = getDisplayLocation('city');
    expect(result).to.equal('city');
  });
});
