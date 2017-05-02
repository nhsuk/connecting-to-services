const nock = require('nock');
const cheerio = require('cheerio');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../server');
const constants = require('../../app/lib/constants');
const messages = require('../../app/lib/messages');
const getSampleResponse = require('../resources/getSampleResponse');
const iExpect = require('../lib/expectations');

const expect = chai.expect;

chai.use(chaiHttp);

const resultsRoute = `${constants.SITE_ROOT}/results`;
const numberOfOpenResults = constants.numberOfOpenResults;
const numberOfNearbyResults = constants.numberOfNearbyResultsToRequest;

describe('The results page', () => {
  it('should return 1 open result and 3 nearby results, by default', (done) => {
    const ls27ue = 'LS2 7UE';
    const ls27ueResponse = getSampleResponse('postcodesio-responses/ls27ue.json');
    const serviceApiResponse = getSampleResponse('service-api-responses/-1,54.json');
    const ls27ueResult = JSON.parse(ls27ueResponse).result;
    const latitude = ls27ueResult.latitude;
    const longitude = ls27ueResult.longitude;

    nock('https://api.postcodes.io')
      .get(`/postcodes/${encodeURIComponent(ls27ue)}`)
      .times(1)
      .reply(200, ls27ueResponse);

    nock(process.env.API_BASE_URL)
      .get(`/nearby?latitude=${latitude}&longitude=${longitude}&limits:results:open=${numberOfOpenResults}&limits:results:nearby=${numberOfNearbyResults}`)
      .times(1)
      .reply(200, serviceApiResponse);

    chai.request(server)
      .get(resultsRoute)
      .query({ location: ls27ue })
      .end((err, res) => {
        iExpect.htmlWith200Status(err, res);
        const $ = cheerio.load(res.text);

        expect($('.results__header--nearest').text())
          .to.equal(`Nearest open pharmacy to ${ls27ue}`);

        expect($('.results__header--nearby').text())
          .to.equal('Other pharmacies nearby');

        const openResults = $('.results__details-nearest .results__maplink');
        expect(openResults.length).to.equal(1);

        const nearbyResults = $('.results__item--nearby');
        expect(nearbyResults.length).to.equal(constants.numberOfNearbyResultsToDisplay);

        const mapLinks = $('.results__maplink');
        mapLinks.toArray().forEach((link) => {
          expect($(link).attr('href')).to.have.string('https://maps.google.com');
        });

        expect($('.link-back').text()).to.equal('Back to find a pharmacy');
        expect($('.link-back').attr('href')).to.equal(`${constants.SITE_ROOT}/find-help`);
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

        expect($('.results__header--none-open').text()).to.be.equal(`There are no pharmacies open now within 20 miles of ${outcode}`);
        expect($('.results-none-nearby').length).to.be.equal(0);
        done();
      });
  });

  it('should display no pharmacies message for non-english postcodes', (done) => {
    const outcode = 'BT1';

    chai.request(server)
      .get(resultsRoute)
      .query({ location: outcode })
      .end((err, res) => {
        iExpect.htmlWith200Status(err, res);
        const $ = cheerio.load(res.text);

        expect($('.results__header--none').text()).to.be.equal(`There are no pharmacies within 20 miles of ${outcode}`);
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

        expect($('.results-none-nearby').text()).to.be.equal(`There are no other pharmacies within 20 miles of ${outcode}`);
        expect($('.results-none').length).to.be.equal(0);
        done();
      });
  });

  it('should display a message when there are no nearby and no open pharmacies', (done) => {
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

        expect($('.results__header--none').text()).to
          .be.equal(`There are no pharmacies within 20 miles of ${outcode}`);
        expect($('.results__none-content').text()).to
          .contain('This service only provides information about pharmacies in England');
        expect($('.results-none-nearby').length).to.be.equal(0);
        done();
      });
  });
});

describe('The results page error handling', () => {
  const notFoundResponse = getSampleResponse('postcodesio-responses/404.json');

  it('should lookup a valid but unknown postcode and return an error message',
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
          const $ = cheerio.load(res.text);

          expect($('.error-summary-heading').text()).to
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
        iExpect.findHelpPageInvalidEntry($);
        expect($('.error-summary-heading').text()).to
          .contain(messages.invalidPostcodeMessage(invalidPostcode));
        done();
      });
  });

  it('should handle an error produced by the postcode lookup and return an error message', (done) => {
    const postcode = 'AB12 3CD';

    nock('https://api.postcodes.io')
      .get(`/postcodes/${encodeURIComponent(postcode)}`)
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
          .to.contain(messages.technicalProblems());
        done();
      });
  });

  it('should handle the pharmacy service when it responds with a 500 response with an error message', (done) => {
    const fakePostcode = 'FA12 3KE';
    const fakeResponse = getSampleResponse('postcodesio-responses/fake.json');
    const latitude = JSON.parse(fakeResponse).result.latitude;
    const longitude = JSON.parse(fakeResponse).result.longitude;

    nock('https://api.postcodes.io')
      .get(`/postcodes/${encodeURIComponent(fakePostcode)}`)
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
          .to.contain(messages.technicalProblems());
        done();
      });
  });

  it('should handle a response from the pharmacy service when there has been an error based on the input', (done) => {
    const badPostcode = 'BA40 0AD';
    const badResponse = getSampleResponse('postcodesio-responses/bad.json');
    const badPharmacyResponse = getSampleResponse('service-api-responses/bad.json');
    const latitude = JSON.parse(badResponse).result.latitude;
    const longitude = JSON.parse(badResponse).result.longitude;

    nock('https://api.postcodes.io')
      .get(`/postcodes/${encodeURIComponent(badPostcode)}`)
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
          .to.contain(messages.technicalProblems());
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
          .to.contain(messages.technicalProblems());
        done();
      });
  });
});
