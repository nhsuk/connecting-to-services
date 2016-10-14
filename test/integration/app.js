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
      .get('/symptoms/stomach-ache')
      .end((err, res) => {
        checkHtmlResponse(err, res);

        const $ = cheerio.load(res.text);

        expect($('.local-header--title').text())
          .to.equal('Stomach ache');
        done();
      });
  });
});

describe('The find help page', () => {
  it('should contain content for finding help with stomach ache', (done) => {
    chai.request(server)
      .get('/symptoms/stomach-ache/find-help')
      .end((err, res) => {
        checkHtmlResponse(err, res);

        const $ = cheerio.load(res.text);

        expect($('.local-header--title--question').text())
          .to.equal('Find a place that can help you');
        done();
      });
  });
});

describe('The search page', () => {
  it('should provide a prompt to enter a postcode', (done) => {
    chai.request(server)
      .get('/symptoms/stomach-ache/search')
      .query({ able: 'true' })
      .end((err, res) => {
        checkHtmlResponse(err, res);

        const $ = cheerio.load(res.text);

        expect($('h1 .local-header--title--question').text())
          .to.equal('Your location');
        done();
      });
  });

  it('should return a cannot travel page when people are not able to get there',
    (done) => {
      chai.request(server)
        .get('/symptoms/stomach-ache/search')
        .query({ able: 'false' })
        .end((err, res) => {
          checkHtmlResponse(err, res);

          const $ = cheerio.load(res.text);

          expect($('.local-header--title--question').text())
            .to.equal('You cannot travel to a pharmacy');
          done();
        });
    });
});

describe('The file loading results page', () => {
  const postcode = 'AB123CD';
  describe('happy paths', () => {
    it('should return 10 results', (done) => {
      chai.request(server)
        .get('/symptoms/stomach-ache/results-file')
        .query({ location: postcode })
        .end((err, res) => {
          checkHtmlResponse(err, res);
          // TODO: Check the specific results are correct, as loaded from the known file
          // TODO: When the postcode lookup is done to get the coords that request will need mocking
          done();
        });
    });
  });
});

describe('The results page', () => {
  let originalUrl = '';
  let originalApikey = '';
  const resultsRoute = '/symptoms/stomach-ache/results';
  const baseUrl = 'http://web.site';
  const apikey = 'secret';
  const paddedPostcode = '   AB123CD   ';
  const postcode = paddedPostcode.trim();
  const postcodeSearchPath =
    new RegExp(`/organisations/pharmacies/postcode/${postcode}`);

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


  describe('happy paths', () => {
    it('should return 10 results', (done) => {
      const postcodeSearchResponse = getSampleResponse('paged_pharmacies_postcode_search');
      const overviewResponse = getSampleResponse('pharmacy_opening_times');

      const postcodeSearchScope =
        nock(baseUrl)
          .get(postcodeSearchPath)
          .query(true)
          .times(10)
          .reply(200, postcodeSearchResponse);

      const overviewScope =
        nock(baseUrl)
          .get(/organisations\/pharmacies\/\d+\/overview\.xml/)
          .query(true)
          .times(100)
          .reply(200, overviewResponse);

      chai.request(server)
        .get(resultsRoute)
        .query({ location: paddedPostcode })
        .end((err, res) => {
          checkHtmlResponse(err, res);

          const $ = cheerio.load(res.text);

          // Some arbitary element to suggest there are 10 results
          expect($('.cta-blue').length).to.equal(10);
          expect($('.list-tab__link').attr('href'))
            .to.equal(`/symptoms/stomach-ache/results?location=${postcode}&open=true`);
          expect(postcodeSearchScope.isDone()).to.be.true;
          expect(overviewScope.isDone()).to.be.true;
          done();
        });
    });

    it('should only return 3 results when filtered by open', function filterTest(done) {
      // This can not be an arrow function due to the use of this.timeout
      // https://github.com/mochajs/mocha/issues/2018
      this.timeout(3000);
      const postcodeSearchResponse = getSampleResponse('paged_pharmacies_postcode_search');
      const overviewResponse = getSampleResponse('always_open');

      const postcodeSearchScope =
        nock(baseUrl)
          .get(postcodeSearchPath)
          .query(true)
          .times(10)
          .reply(200, postcodeSearchResponse);

      const overviewScope =
        nock(baseUrl)
          .get(/organisations\/pharmacies\/\d+\/overview\.xml/)
          .query(true)
          .times(100)
          .reply(200, overviewResponse);

      chai.request(server)
        .get(resultsRoute)
        .query({ location: paddedPostcode, open: true })
        .end((err, res) => {
          checkHtmlResponse(err, res);

          const $ = cheerio.load(res.text);

          // Some arbitary element to suggest there are 2 results
          expect($('.cta-blue').length).to.equal(3);
          expect($('.list-tab__link').attr('href'))
            .to.equal(`/symptoms/stomach-ache/results?location=${postcode}`);
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
        .get(resultsRoute)
        .query({ location: invalidPostcode })
        .end((err, res) => {
          checkHtmlResponse(err, res);
          expect(res.text).to.contain(errorMessage);
          done();
        });
    });

    it('should check a location is supplied and return an error message', (done) => {
      chai.request(server)
        .get(resultsRoute)
        .end((err, res) => {
          checkHtmlResponse(err, res);
          expect(res.text).to.contain('A valid postcode is required to progress');
          done();
        });
    });
  });
});
