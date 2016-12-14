const chai = require('chai');
const nock = require('nock');
const postcodes = require('../../../app/lib/postcodes');
const getSampleResponse = require('../../resources/getSampleResponse');
const messages = require('../../../app/lib/messages');

const expect = chai.expect;

describe('Postcodes', () => {
  describe('lookup', () => {
    const postcode = 'AB12 3CD';
    const postcodeForRequest = encodeURIComponent(postcode);
    const response404 = JSON.parse(getSampleResponse('postcodesio-responses/404.json'));

    describe('happy path', () => {
      const outcode = 'AB1';
      const postcodeRes = { locals: { location: postcode } };
      const outcodeRes = { locals: { location: outcode } };

      it('should lookup a full postcode and return the coordinates', (done) => {
        const postcodeResponse = JSON.parse(getSampleResponse('postcodesio-responses/ls27ue.json'));
        const expectedLatitude = postcodeResponse.result.latitude;
        const expectedLongitude = postcodeResponse.result.longitude;

        nock('https://api.postcodes.io')
          .get(`/postcodes/${postcodeForRequest}`)
          .reply(200, postcodeResponse);

        postcodes.lookup(postcodeRes, () => {
          const coords = postcodeRes.locals.coordinates;

          expect(coords).to.not.be.equal(null);
          expect(coords.latitude).to.be.equal(expectedLatitude);
          expect(coords.longitude).to.be.equal(expectedLongitude);
          done();
        });
      });

      it('should lookup an outcode', (done) => {
        const outcodeResponse = JSON.parse(getSampleResponse('postcodesio-responses/bh1.json'));
        const expectedLatitude = outcodeResponse.result.latitude;
        const expectedLongitude = outcodeResponse.result.longitude;

        nock('https://api.postcodes.io')
          .get(`/outcodes/${outcode}`)
          .reply(200, outcodeResponse);

        postcodes.lookup(outcodeRes, () => {
          const coords = outcodeRes.locals.coordinates;

          expect(coords).to.not.be.equal(null);
          expect(coords.latitude).to.be.equal(expectedLatitude);
          expect(coords.longitude).to.be.equal(expectedLongitude);
          done();
        });
      });
    });

    describe('postcode errors', () => {
      const postcode404 = 'AB12 3CD';
      const postcode404Res = { locals: { location: postcode404 } };

      it('should return null when postcode is not found', (done) => {
        nock('https://api.postcodes.io')
          .get(`/postcodes/${encodeURIComponent(postcode404)}`)
          .reply(404, response404);

        postcodes.lookup(postcode404Res, (err) => {
          expect(err.message).to.be.equal(messages.invalidPostcodeMessage(postcode404));
          expect(postcode404Res.locals.coordinates).to.be.equal(undefined);
          done();
        });
      });
    });

    describe('server errors', () => {
      it('should return an error when postcode service throws a 500 error', (done) => {
        const postcodeRes = { locals: { location: postcode } };

        nock('https://api.postcodes.io')
          .get(`/postcodes/${postcodeForRequest}`)
          .reply(500);

        postcodes.lookup(postcodeRes, (err) => {
          expect(err.type).to.be.equal('postcode-service-error');
          expect(err.message).to.be.equal('Postcode service error: 500');
          expect(postcodeRes.locals.coordinates).to.be.equal(undefined);
          done();
        });
      });

      it('should return error when postcode service is unavailable', (done) => {
        const postcodeRes = { locals: { location: postcode } };
        const errorMessage = 'getaddrinfo ENOTFOUND api.postcodes.io api.postcodes.io:443';

        nock('https://api.postcodes.io')
          .get(`/postcodes/${postcodeForRequest}`)
          .replyWithError({ message: errorMessage });

        postcodes.lookup(postcodeRes, (err) => {
          expect(err.type).to.be.equal('postcode-service-error');
          expect(err.message).to.be.equal(errorMessage);
          expect(postcodeRes.locals.coordinates).to.be.equal(undefined);
          done();
        });
      });
    });

    describe('outcode errors', () => {
      const outcode404 = 'AB1';
      const outcode404Res = { locals: { location: outcode404 } };

      it('should return null when outcode is not found', (done) => {
        nock('https://api.postcodes.io')
          .get(`/outcodes/${outcode404}`)
          .reply(404, response404);

        postcodes.lookup(outcode404Res, (err) => {
          expect(err.message).to.be.equal(messages.invalidPostcodeMessage(outcode404));
          expect(outcode404Res.locals.coordinates).to.be.equal(undefined);
          done();
        });
      });
    });
  });
});
