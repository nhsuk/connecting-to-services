const chai = require('chai');
const chaiHttp = require('chai-http');
const cheerio = require('cheerio');
const nock = require('nock');
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
          expect($(link).attr('href')).to.have.string(`https://maps.google.com/maps?saddr=${encodeURIComponent(ls27ue)}`);
        });

        expect($('title').text()).to.equal('Pharmacies near LS2 7UE - NHS.UK');
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
        expect($('title').text()).to.equal('Pharmacies near BA1 - NHS.UK');
        done();
      });
  });

  it('should display no pharmacies and formatted postcode message for non-english postcodes', (done) => {
    const outcode = 'bt1';
    const outcodeFormatted = 'BT1';

    const postcodeResponse = getSampleResponse('postcodesio-responses/bt1.json');
    const latitude = JSON.parse(postcodeResponse).result.latitude;
    const longitude = JSON.parse(postcodeResponse).result.longitude;
    const noResultsResponse = getSampleResponse('service-api-responses/BA3.json');
    nock('https://api.postcodes.io')
      .get(`/outcodes/${outcodeFormatted}`)
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

        expect($('.results__header--none').text()).to.be.equal(`We can't find any pharmacies near ${outcodeFormatted}`);
        expect($('.results__none-content').text()).to
          .contain('This service only provides information about pharmacies in England.');
        expect($('.results__none-content').text()).to
          .contain('If you need a pharmacy in Scotland, Wales, Northern Ireland or the Isle of Man, you can use one of the following websites.');
        expect($('.results-none-nearby').length).to.be.equal(0);
        expect($('title').text()).to.equal('Pharmacies near BT1 - NHS.UK');
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
          .be.equal(`We can't find any pharmacies near ${outcode}`);
        expect($('.results__none-content').text()).to
          .contain('This service only provides information about pharmacies in England.');
        expect($('.results__none-content').text()).to
          .contain('If you need a pharmacy in Scotland, Wales, Northern Ireland or the Isle of Man, you can use one of the following websites.');
        expect($('.results-none-nearby').length).to.be.equal(0);
        done();
      });
  });
});

describe('The results page error handling', () => {
  const notFoundResponse = getSampleResponse('postcodesio-responses/404.json');

  it(
    'should lookup a valid but unknown postcode and return an error message with postcode in uppercase',
    (done) => {
      const unknownPostcode = 'ls0';
      const unknownPostcodeUppercase = 'LS0';

      nock('https://api.postcodes.io')
        .get(`/outcodes/${unknownPostcodeUppercase}`)
        .times(1)
        .reply(404, notFoundResponse);

      chai.request(server)
        .get(resultsRoute)
        .query({ location: unknownPostcode })
        .end((err, res) => {
          iExpect.htmlWith200Status(err, res);
          const $ = cheerio.load(res.text);

          expect($('.error-summary-heading').text()).to
            .contain(`We can't find the postcode '${unknownPostcodeUppercase}'`);
          expect($('title').text()).to.equal(`Find a pharmacy - We can't find the postcode '${unknownPostcode}' - NHS.UK`);
          expect($('.form-label-bold').text()).to.equal('Enter a town, city or postcode in England');
          done();
        });
    }
  );

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
        expect(res).to.be.html;

        const $ = cheerio.load(res.text);

        expect($('.page-section').text()).to.not.contain('For help with');
        expect($('.local-header--title--question').text())
          .to.contain(messages.technicalProblems());
        expect($('title').text())
          .to.equal('Sorry, we are experiencing technical problems - NHS.UK');
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
        expect(res).to.be.html;

        const $ = cheerio.load(res.text);

        expect($('.page-section').text()).to.not.contain('For help with');
        expect($('.local-header--title--question').text())
          .to.contain(messages.technicalProblems());
        done();
      });
  });
});

describe('Return to Choices banner', () => {
  it('should have a link back to the Choices pharmacy finder', (done) => {
    chai.request(server)
      .get(resultsRoute)
      .query({ location: 'ls2' })
      .end((err, res) => {
        const $ = cheerio.load(res.text);

        expect($('.back-to-choices').attr('href'))
          .to.equal('https://www.nhs.uk/Service-Search/Pharmacy/LocationSearch/10?nobeta=true');
        done();
      });
  });
});
