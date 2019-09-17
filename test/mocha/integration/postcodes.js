const chai = require('chai');
const lookup = require('../../../app/lib/postcodes').lookup;

const expect = chai.expect;

describe('Postcode to lat long', () => {
  it('should return lat long for valid England postcode', (done) => {
    const res = { locals: { location: 'BD24 9PT' } };
    lookup(res, () => {
      expect(res.locals.coordinates).to.exist;
      expect(res.locals.coordinates.latitude).to.exist;
      expect(res.locals.coordinates.longitude).to.exist;
      done();
    });
  });
});
