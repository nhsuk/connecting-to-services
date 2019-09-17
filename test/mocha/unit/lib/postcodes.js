const chai = require('chai');
const nock = require('nock');

const getSampleResponse = require('../../resources/getSampleResponse');
const messages = require('../../../../app/lib/messages');
const postcodes = require('../../../../app/lib/postcodes');
const postcodesIOURL = require('../../lib/constants').postcodesIOURL;

const expect = chai.expect;

describe('Postcodes', () => {
  after('clean nock', () => {
    nock.cleanAll();
  });

  describe('lookup', () => {
    const postcode = 'AB12 3CD';
    const postcodeForRequest = encodeURIComponent(postcode);
    const response404 = JSON.parse(getSampleResponse('postcodesio-responses/404.json'));

    describe('happy path', () => {
      const outcode = 'AB1';
      const postcodeRes = { locals: { location: postcode } };
      const outcodeRes = { locals: { location: outcode } };

      it('should lookup a full postcode and return the coordinates', async () => {
        const postcodeResponse = JSON.parse(getSampleResponse('postcodesio-responses/ls27ue.json'));
        const expectedLatitude = postcodeResponse.result.latitude;
        const expectedLongitude = postcodeResponse.result.longitude;
        let testRun = false;

        nock(postcodesIOURL)
          .get(`/postcodes/${postcodeForRequest}`)
          .reply(200, postcodeResponse);

        await postcodes.lookup(postcodeRes, () => { testRun = true; })
          .then(() => {
            const coords = postcodeRes.locals.coordinates;

            expect(coords).to.not.be.equal(null);
            expect(coords.latitude).to.be.equal(expectedLatitude);
            expect(coords.longitude).to.be.equal(expectedLongitude);
          })
          .catch(() => expect.fail());
        expect(testRun).to.be.true;
      });

      it('should lookup an outcode', async () => {
        const outcodeResponse = JSON.parse(getSampleResponse('postcodesio-responses/bh1.json'));
        const expectedLatitude = outcodeResponse.result.latitude;
        const expectedLongitude = outcodeResponse.result.longitude;
        let testRun = false;

        nock(postcodesIOURL)
          .get(`/outcodes/${outcode}`)
          .reply(200, outcodeResponse);

        await postcodes.lookup(outcodeRes, () => { testRun = true; })
          .then(() => {
            const coords = outcodeRes.locals.coordinates;

            expect(coords).to.not.be.equal(null);
            expect(coords.latitude).to.be.equal(expectedLatitude);
            expect(coords.longitude).to.be.equal(expectedLongitude);
          })
          .catch(() => expect.fail());
        expect(testRun).to.be.true;
      });
    });

    describe('postcode errors', () => {
      const postcode404 = 'AB12 3CD';
      const postcode404Res = { locals: { location: postcode404 } };

      it('should return null when postcode is not found', async () => {
        nock(postcodesIOURL)
          .get(`/postcodes/${encodeURIComponent(postcode404)}`)
          .reply(404, response404);

        await postcodes.lookup(postcode404Res, (err) => {
          expect(err.message).to.be.equal(messages.invalidPostcodeMessage(postcode404));
          expect(postcode404Res.locals.coordinates).to.be.equal(undefined);
        })
          .catch(() => expect.fail());
      });
    });

    describe('server errors', () => {
      it('should return an error when postcode service throws a 500 error', async () => {
        const postcodeRes = { locals: { location: postcode } };

        nock(postcodesIOURL)
          .get(`/postcodes/${postcodeForRequest}`)
          .reply(500);

        await postcodes.lookup(postcodeRes, (err) => {
          expect(err.type).to.be.equal('postcode-lookup-error');
          expect(err.message).to.be.equal('HTTP 500: Internal Server Error');
          expect(postcodeRes.locals.coordinates).to.be.equal(undefined);
        })
          .catch(() => expect.fail());
      });

      it('should return error when postcode service is unavailable', async () => {
        const postcodeRes = { locals: { location: postcode } };
        const getAddress = `/postcodes/${postcodeForRequest}`;
        const errorMessageBase = `request to ${postcodesIOURL}${getAddress} failed, reason:`;
        const errorMessage = 'Some additional information.';

        nock(postcodesIOURL)
          .get(getAddress)
          .replyWithError({ message: errorMessage });

        await postcodes.lookup(postcodeRes, (err) => {
          expect(err.type).to.be.equal('postcode-lookup-error');
          expect(err.message).to.be.equal(`${errorMessageBase} ${errorMessage}`);
        })
          .catch(() => expect.fail());
      });
    });

    describe('outcode errors', () => {
      const outcode404 = 'AB1';
      const outcode404Res = { locals: { location: outcode404 } };

      it('should return null when outcode is not found', async () => {
        nock(postcodesIOURL)
          .get(`/outcodes/${outcode404}`)
          .reply(404, response404);

        postcodes.lookup(outcode404Res, (err) => {
          expect(err.message).to.be.equal(messages.invalidPostcodeMessage(outcode404));
          expect(outcode404Res.locals.coordinates).to.be.equal(undefined);
        })
          .catch(() => expect.fail());
      });
    });
  });
});
