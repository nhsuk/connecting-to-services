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

  it('Should return lat long for Isle of Man postcode', (done) => {
    const res = { locals: { location: 'IM9 2AS' } };
    lookup(res, () => {
      /* eslint-disable no-unused-expressions */
      expect(res.locals.coordinates).to.exist;
      expect(res.locals.coordinates.latitude).to.exist;
      expect(res.locals.coordinates.longitude).to.exist;
      done();
      /* eslint-enable no-unused-expressions */
    });
  });

  it('Should return lat long for Isle of Man outcode', (done) => {
    const res = { locals: { location: 'IM9' } };
    lookup(res, () => {
      /* eslint-disable no-unused-expressions */
      expect(res.locals.coordinates).to.exist;
      expect(res.locals.coordinates.latitude).to.exist;
      expect(res.locals.coordinates.longitude).to.exist;
      done();
      /* eslint-enable no-unused-expressions */
    });
  });

  it('Should return lat long for Channel Island postcode', (done) => {
    const res = { locals: { location: 'JE1 1BY' } };
    lookup(res, () => {
      /* eslint-disable no-unused-expressions */
      expect(res.locals.coordinates).to.exist;
      expect(res.locals.coordinates.latitude).to.exist;
      expect(res.locals.coordinates.longitude).to.exist;
      done();
      /* eslint-enable no-unused-expressions */
    });
  });

  it('Should return lat long for Jersey outcode', (done) => {
    const res = { locals: { location: 'JE1' } };
    lookup(res, () => {
      /* eslint-disable no-unused-expressions */
      expect(res.locals.coordinates).to.exist;
      expect(res.locals.coordinates.latitude).to.exist;
      expect(res.locals.coordinates.longitude).to.exist;
      done();
      /* eslint-enable no-unused-expressions */
    });
  });

  it('Should return lat long for Guernsey outcode', (done) => {
    const res = { locals: { location: 'GY1' } };
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
