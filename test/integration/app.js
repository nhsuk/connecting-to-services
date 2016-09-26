/* eslint-disable no-unused-expressions */
const nock = require('nock');
const cheerio = require('cheerio');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../server');
const getSampleResponse = require('../resources/getSampleResponse');

const expect = chai.expect;

chai.use(chaiHttp);

function checkHtmlResponse(err, res) {
  expect(err).to.be.null;
  expect(res).to.have.status(200);
  expect(res).to.be.html;
}

describe('The default page', () => {
  it('should return the link for stomach ache', (done) => {
    chai.request(server)
      .get('/')
      .end((err, res) => {
        checkHtmlResponse(err, res);

        const $ = cheerio.load(res.text);

        // Hardly robust but the page is in question of even existing
        expect($('ul.list-bullet li a').text())
          .to.equal('Stomach Ache');
        done();
      });
  });
});

describe('The stomach ache page', () => {
  it('should contain content for stomach ache', (done) => {
    chai.request(server)
      .get('/stomach-ache')
      .end((err, res) => {
        checkHtmlResponse(err, res);

        const $ = cheerio.load(res.text);

        expect($('.local-header--title').text())
          .to.equal('Stomach ache');
        done();
      });
  });
});

describe('The search page', () => {
  it('should provide a prompt to enter a postcode', (done) => {
    chai.request(server)
      .get('/search')
      .query({ able: 'true' })
      .end((err, res) => {
        checkHtmlResponse(err, res);

        const $ = cheerio.load(res.text);

        expect($('.local-header--title').text())
          .to.equal('Enter a postcode');
        done();
      });
  });

  it('should return a call 111 page when people are not able to get there',
    (done) => {
      chai.request(server)
        .get('/search')
        .query({ able: 'false' })
        .end((err, res) => {
          checkHtmlResponse(err, res);

          const $ = cheerio.load(res.text);

          expect($('.local-header--title').text())
            .to.equal('Call NHS 111');
          done();
        });
    });
});

describe('The results routes', () => {
  let originalUrl = '';
  let originalApikey = '';
  const baseUrl = 'http://web.site';
  const apikey = 'secret';
  const validPostcode = 'AB123CD';
  const postcodeSearchPath =
    new RegExp(`/organisations/pharmacies/postcode/${validPostcode}`);

  before('setup environment variables', () => {
    originalUrl = process.env.NHSCHOICES_SYNDICATION_BASEURL;
    originalApikey = process.env.NHSCHOICES_SYNDICATION_APIKEY;

    process.env.NHSCHOICES_SYNDICATION_BASEURL = baseUrl;
    process.env.NHSCHOICES_SYNDICATION_APIKEY = apikey;
  });

  after('reset environemnt variables', () => {
    process.env.NHSCHOICES_SYNDICATION_BASEURL = originalUrl;
    process.env.NHSCHOICES_SYNDICATION_APIKEY = originalApikey;
  });


  describe('The results route', () => {
    it('should return 10 results', (done) => {
      const postcodeSearchResponse = getSampleResponse('paged_pharmacies_postcode_search');
      const overviewResponse = getSampleResponse('pharmacy_opening_times');
      const allResultsRoute = '/results';

      const postcodeSearchScope =
        nock(baseUrl)
          .get(postcodeSearchPath)
          .query(true)
          .times(10)
          .reply(200, postcodeSearchResponse);

      const overviewScope =
        nock(/.*nhschoices.*/)
          .get(/organisations\/pharmacies\/\d+\/overview\.xml/)
          .query(true)
          .times(100)
          .reply(200, overviewResponse);

      chai.request(server)
        .get(allResultsRoute)
        .query({ location: validPostcode })
        .end((err, res) => {
          checkHtmlResponse(err, res);

          const $ = cheerio.load(res.text);

          // Some arbitary element to suggest there are 2 results
          expect($('.map-button').length).to.equal(10);
          expect(postcodeSearchScope.isDone()).to.be.true;
          expect(overviewScope.isDone()).to.be.true;
          done();
        });
    });
  });

  describe('open only results', () => {
    const openResultsRoute = '/results-open';

    describe('happy paths', () => {
      it('should return the top 2 open results when the postcode is valid', (done) => {
        const postcodeSearchResponse = getSampleResponse('paged_pharmacies_postcode_search');
        const overviewResponse = getSampleResponse('always_open');

        const postcodeSearchScope =
          nock(baseUrl)
            .get(postcodeSearchPath)
            .query(true)
            .times(10)
            .reply(200, postcodeSearchResponse);

        const overviewScope =
          nock(/.*nhschoices.*/)
            .get(/organisations\/pharmacies\/\d+\/overview\.xml/)
            .query(true)
            .times(100)
            .reply(200, overviewResponse);

        chai.request(server)
          .get(openResultsRoute)
          .query({ location: validPostcode })
          .end((err, res) => {
            checkHtmlResponse(err, res);

            const $ = cheerio.load(res.text);

            // Some arbitary element to suggest there are 2 results
            expect($('p strong:contains("Open until midnight")').length).to.equal(2);
            expect($('.map-button').length).to.equal(2);
            expect(postcodeSearchScope.isDone()).to.be.true;
            expect(overviewScope.isDone()).to.be.true;
            done();
          });
      });
    });

    describe('error handling', () => {
      it('should validate the postcode and return an error message', (done) => {
        const invalidPostcode = 'invalid';
        const errorMessage =
          `${invalidPostcode} is not a valid postcode, please try again`;

        chai.request(server)
          .get(openResultsRoute)
          .query({ location: invalidPostcode })
          .end((err, res) => {
            checkHtmlResponse(err, res);
            expect(res.text).to.contain(errorMessage);
            done();
          });
      });

      it('should check a location is supplied and return an error message', (done) => {
        chai.request(server)
          .get(openResultsRoute)
          .end((err, res) => {
            checkHtmlResponse(err, res);
            expect(res.text).to.contain('A valid postcode is required to progress');
            done();
          });
      });
    });
  });
});

