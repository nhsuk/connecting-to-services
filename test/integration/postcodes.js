const chai = require('chai');
const lookup = require('../../app/lib/postcodes').lookup;

const expect = chai.expect;

describe('Postcode to lat long', () => {
  it('Should return lat long for valid England postcode', (done) => {
    const res = { locals: { location: 'LS11 5RU' } };
    lookup(res, () => {
      /* eslint-disable no-unused-expressions */
      expect(res.locals.coordinates).to.exist;
      expect(res.locals.coordinates.latitude).to.exist;
      expect(res.locals.coordinates.longitude).to.exist;
      done();
      /* eslint-enable no-unused-expressions */
    });
  });
});
