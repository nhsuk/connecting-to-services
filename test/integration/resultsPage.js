const nock = require('nock');
const cheerio = require('cheerio');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../server');
const constants = require('../../app/lib/constants');
const messages = require('../../app/lib/messages');
const getSampleResponse = require('../resources/getSampleResponse');
const iExpect = require('../lib/expectations');
const contexts = require('../../app/lib/contexts');

const expect = chai.expect;

chai.use(chaiHttp);

const resultsRoute = `${constants.SITE_ROOT}/results`;
const numberOfOpenResults = constants.numberOfOpenResults;
const numberOfNearbyResults = constants.numberOfNearbyResultsToRequest;

describe('The results page', () => {
  it('should return 1 open result and 3 nearby results, by default', (done) => {
    const ls27ue = 'LS27UE';
    const ls27ueResponse = getSampleResponse('postcodesio-responses/ls27ue.json');
    const serviceApiResponse = getSampleResponse('service-api-responses/-1,54.json');
    const ls27ueResult = JSON.parse(ls27ueResponse).result;
    const latitude = ls27ueResult.latitude;
    const longitude = ls27ueResult.longitude;
    const context = contexts.stomachAche.context;

    nock('https://api.postcodes.io')
      .get(`/postcodes/${ls27ue}`)
      .times(1)
      .reply(200, ls27ueResponse);

    nock(process.env.API_BASE_URL)
      .get(`/nearby?latitude=${latitude}&longitude=${longitude}&limits:results:open=${numberOfOpenResults}&limits:results:nearby=${numberOfNearbyResults}`)
      .times(1)
      .reply(200, serviceApiResponse);

    chai.request(server)
      .get(resultsRoute)
      .query({ location: ls27ue, context })
      .end((err, res) => {
        iExpect.htmlWith200Status(err, res);
        const $ = cheerio.load(res.text);

        expect($('.results__type--nearest').text())
          .to.equal(`Pharmacy nearest to ${ls27ue} open now`);

        expect($('.results__type--nearby').text())
          .to.equal(`Next closest pharmacies to ${ls27ue}`);

        const openResults = $('.results__details-nearest .results__maplink');
        expect(openResults.length).to.equal(1);

        const nearbyResults = $('.results__item--nearby');
        expect(nearbyResults.length).to.equal(constants.numberOfNearbyResultsToDisplay);

        const mapLinks = $('.results__maplink');
        mapLinks.toArray().forEach((link) => {
          expect($(link).attr('href')).to.have.string('https://maps.google.com');
        });

        expect($('.link-back').text()).to.equal('Back to find a pharmacy');
        expect($('.link-back').attr('href')).to.equal(`${constants.SITE_ROOT}/find-help?context=${context}`);
        done();
      });
  });

  it('should display a message when there are no open pharmacies', (done) => {
    const outcode = 'BA1';
    const postcodeResponse = getSampleResponse('postcodesio-responses/BA1.json');
    const noOpenResponse = getSampleResponse('service-api-responses/BA1.json');
    const latitude = JSON.parse(postcodeResponse).result.latitude;
    const longitude = JSON.parse(postcodeResponse).result.longitude;

    nock('https://api.postcodes.io')
      .get(`/outcodes/${outcode}`)
      .times(1)
      .reply(200, postcodeResponse);

    nock(process.env.API_BASE_URL)
      .get(`/nearby?latitude=${latitude}&longitude=${longitude}&limits:results:open=${numberOfOpenResults}&limits:results:nearby=${numberOfNearbyResults}`)
      .times(1)
      .reply(200, noOpenResponse);

    chai.request(server)
      .get(resultsRoute)
      .query({ location: outcode })
      .end((err, res) => {
        iExpect.htmlWith200Status(err, res);
        const $ = cheerio.load(res.text);

        expect($('.results-none-open').text()).to.be.equal(`There are no pharmacies open now within 20 miles of ${outcode}`);
        expect($('.results-none-nearby').length).to.be.equal(0);
        done();
      });
  });

  it('should display a message when there is an open pharmacy but no additional nearby pharmacies', (done) => {
    const outcode = 'BA2';
    const postcodeResponse = getSampleResponse('postcodesio-responses/BA2.json');
    const noNearbyResponse = getSampleResponse('service-api-responses/BA2.json');
    const latitude = JSON.parse(postcodeResponse).result.latitude;
    const longitude = JSON.parse(postcodeResponse).result.longitude;

    nock('https://api.postcodes.io')
      .get(`/outcodes/${outcode}`)
      .times(1)
      .reply(200, postcodeResponse);

    nock(process.env.API_BASE_URL)
      .get(`/nearby?latitude=${latitude}&longitude=${longitude}&limits:results:open=${numberOfOpenResults}&limits:results:nearby=${numberOfNearbyResults}`)
      .times(1)
      .reply(200, noNearbyResponse);

    chai.request(server)
      .get(resultsRoute)
      .query({ location: outcode })
      .end((err, res) => {
        iExpect.htmlWith200Status(err, res);
        const $ = cheerio.load(res.text);

        expect($('.results-none-nearby').text()).to.be.equal('There are no pharmacies within 20 miles of your location');
        expect($('.results-none').length).to.be.equal(0);
        done();
      });
  });

  it('should display a message when there are no open pharmacies', (done) => {
    const outcode = 'BA3';
    const postcodeResponse = getSampleResponse('postcodesio-responses/BA3.json');
    const noResultsResponse = getSampleResponse('service-api-responses/BA3.json');
    const latitude = JSON.parse(postcodeResponse).result.latitude;
    const longitude = JSON.parse(postcodeResponse).result.longitude;

    nock('https://api.postcodes.io')
      .get(`/outcodes/${outcode}`)
      .times(1)
      .reply(200, postcodeResponse);

    nock(process.env.API_BASE_URL)
      .get(`/nearby?latitude=${latitude}&longitude=${longitude}&limits:results:open=${numberOfOpenResults}&limits:results:nearby=${numberOfNearbyResults}`)
      .times(1)
      .reply(200, noResultsResponse);

    chai.request(server)
      .get(resultsRoute)
      .query({ location: outcode })
      .end((err, res) => {
        iExpect.htmlWith200Status(err, res);
        const $ = cheerio.load(res.text);

        expect($('.results-none').text()).to.be.equal('There are no pharmacies within 20 miles of your location');
        expect($('.results-block').text()).to.contain('Call 111 for:');
        expect($('.results-none-nearby').length).to.be.equal(0);
        done();
      });
  });
});

describe('The results page error handling', () => {
  describe('with a context', () => {
    const notFoundResponse = getSampleResponse('postcodesio-responses/404.json');
    const context = contexts.stomachAche.context;

    it('should lookup a valid but unknown postcode and return an error message with the help context',
        (done) => {
          const invalidPostcodePassingRegex = 'LS0';

          nock('https://api.postcodes.io')
            .get(`/outcodes/${invalidPostcodePassingRegex}`)
            .times(1)
            .reply(404, notFoundResponse);

          chai.request(server)
            .get(resultsRoute)
            .query({ location: invalidPostcodePassingRegex, context })
            .end((err, res) => {
              iExpect.htmlWith200Status(err, res);
              const $ = cheerio.load(res.text);

              expect($('.link-back').text()).to.equal('Back to information on stomach ache');
              iExpect.findHelpPage($);
              expect(res.text).to
                .contain(messages.invalidPostcodeMessage(invalidPostcodePassingRegex));
              done();
            });
        });

    it('should only validate the postcode and return an error message along with the help context',
        (done) => {
          const invalidPostcode = 'invalid';
          const errorMessage =
            `${invalidPostcode} is not a valid postcode, please try again`;

          chai.request(server)
            .get(resultsRoute)
            .query({ location: invalidPostcode, context })
            .end((err, res) => {
              iExpect.htmlWith200Status(err, res);
              const $ = cheerio.load(res.text);

              expect($('.link-back').text()).to.equal('Back to information on stomach ache');
              iExpect.findHelpPage($);
              expect(res.text).to.contain(errorMessage);
              done();
            });
        });

    it('should handle an error produced by the postcode lookup and return an error message', (done) => {
      const postcode = 'AB123CD';

      nock('https://api.postcodes.io')
        .get(`/postcodes/${postcode}`)
        .times(1)
        .reply(500);

      chai.request(server)
        .get(resultsRoute)
        .query({ location: postcode, context })
        .end((err, res) => {
          expect(err).to.not.be.equal(null);
          expect(res).to.have.status(500);
          // eslint-disable-next-line no-unused-expressions
          expect(res).to.be.html;

          const $ = cheerio.load(res.text);

          expect($('.page-section').text()).to.not.contain('For help with');
          expect($('.local-header--title--question').text())
            .to.contain('Sorry, we are experiencing technical problems');
          done();
        });
    });
  });

  describe('with no context', () => {
    const notFoundResponse = getSampleResponse('postcodesio-responses/404.json');

    it('should lookup a valid but unknown postcode and return an error message with no context',
      (done) => {
        const invalidPostcodePassingRegex = 'LS0';

        nock('https://api.postcodes.io')
          .get(`/outcodes/${invalidPostcodePassingRegex}`)
          .times(1)
          .reply(404, notFoundResponse);

        chai.request(server)
          .get(resultsRoute)
          .query({ location: invalidPostcodePassingRegex })
          .end((err, res) => {
            iExpect.htmlWith200Status(err, res);
            expect(res.text).to
              .contain(messages.invalidPostcodeMessage(invalidPostcodePassingRegex));
            done();
          });
      });

    it('should only validate the postcode and return an error message', (done) => {
      const invalidPostcode = 'invalid';

      chai.request(server)
        .get(resultsRoute)
        .query({ location: invalidPostcode })
        .end((err, res) => {
          iExpect.htmlWith200Status(err, res);
          const $ = cheerio.load(res.text);

          expect($('.page-section').text()).to.not.contain('For help with');
          iExpect.findHelpPage($);
          expect(res.text).to.contain(messages.invalidPostcodeMessage(invalidPostcode));
          done();
        });
    });

    it('should handle an error produced by the postcode lookup and return an error message', (done) => {
      const postcode = 'AB123CD';

      nock('https://api.postcodes.io')
        .get(`/postcodes/${postcode}`)
        .times(1)
        .reply(500);

      chai.request(server)
        .get(resultsRoute)
        .query({ location: postcode })
        .end((err, res) => {
          expect(err).to.not.be.equal(null);
          expect(res).to.have.status(500);
          // eslint-disable-next-line no-unused-expressions
          expect(res).to.be.html;

          const $ = cheerio.load(res.text);

          expect($('.page-section').text()).to.not.contain('For help with');
          expect($('.local-header--title--question').text())
            .to.contain('Sorry, we are experiencing technical problems');
          done();
        });
    });

    it('should handle the pharmacy service when it responds with a 500 response with an error message', (done) => {
      const fakePostcode = 'FA123KE';
      const fakeResponse = getSampleResponse('postcodesio-responses/fake.json');
      const latitude = JSON.parse(fakeResponse).result.latitude;
      const longitude = JSON.parse(fakeResponse).result.longitude;

      nock('https://api.postcodes.io')
        .get(`/postcodes/${fakePostcode}`)
        .times(1)
        .reply(200, fakeResponse);

      nock(process.env.API_BASE_URL)
        .get(`/nearby?latitude=${latitude}&longitude=${longitude}&limits:results:open=${numberOfOpenResults}&limits:results:nearby=${numberOfNearbyResults}`)
        .reply(500);

      chai.request(server)
        .get(resultsRoute)
        .query({ location: fakePostcode })
        .end((err, res) => {
          expect(err).to.not.be.equal(null);
          expect(res).to.have.status(500);
          // eslint-disable-next-line no-unused-expressions
          expect(res).to.be.html;

          const $ = cheerio.load(res.text);

          expect($('.page-section').text()).to.not.contain('For help with');
          expect($('.local-header--title--question').text())
            .to.contain('Sorry, we are experiencing technical problems');
          done();
        });
    });

    it('should handle a response from the pharmacy service when there has been an error based on the input', (done) => {
      const badPostcode = 'BA400AD';
      const badResponse = getSampleResponse('postcodesio-responses/bad.json');
      const badPharmacyResponse = getSampleResponse('service-api-responses/bad.json');
      const latitude = JSON.parse(badResponse).result.latitude;
      const longitude = JSON.parse(badResponse).result.longitude;

      nock('https://api.postcodes.io')
        .get(`/postcodes/${badPostcode}`)
        .times(1)
        .reply(200, badResponse);

      nock(process.env.API_BASE_URL)
        .get(`/nearby?latitude=${latitude}&longitude=${longitude}&limits:results:open=${numberOfOpenResults}&limits:results:nearby=${numberOfNearbyResults}`)
        .reply(400, badPharmacyResponse);

      chai.request(server)
        .get(resultsRoute)
        .query({ location: badPostcode })
        .end((err, res) => {
          expect(err).to.not.be.equal(null);
          expect(res).to.have.status(500);
          // eslint-disable-next-line no-unused-expressions
          expect(res).to.be.html;

          const $ = cheerio.load(res.text);

          expect($('.page-section').text()).to.not.contain('For help with');
          expect($('.local-header--title--question').text())
            .to.contain('Sorry, we are experiencing technical problems');
          done();
        });
    });

    it('it should handle the pharmacy service being unavailable with an error message', (done) => {
      const badOutcode = 'G51';
      const badResponse = getSampleResponse('postcodesio-responses/G51.json');
      const latitude = JSON.parse(badResponse).result.latitude;
      const longitude = JSON.parse(badResponse).result.longitude;

      nock('https://api.postcodes.io')
        .get(`/outcodes/${badOutcode}`)
        .times(1)
        .reply(200, badResponse);

      nock(process.env.API_BASE_URL)
        .get(`/nearby?latitude=${latitude}&longitude=${longitude}&limits:results:open=${numberOfOpenResults}&limits:results:nearby=${numberOfNearbyResults}`)
        .replyWithError({ message: `connect ECONNREFUSED ${process.env.API_BASE_URL}:3001` });

      chai.request(server)
        .get(resultsRoute)
        .query({ location: badOutcode })
        .end((err, res) => {
          expect(err).to.not.be.equal(null);
          expect(res).to.have.status(500);
          // eslint-disable-next-line no-unused-expressions
          expect(res).to.be.html;

          const $ = cheerio.load(res.text);

          expect($('.page-section').text()).to.not.contain('For help with');
          expect($('.local-header--title--question').text())
            .to.contain('Sorry, we are experiencing technical problems');
          done();
        });
    });
  });
});
