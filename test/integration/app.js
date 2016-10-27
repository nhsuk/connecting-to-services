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

describe('redirection', () => {
  it('default should be find help page', (done) => {
    chai.request(server)
      .get('/')
      .end((err, res) => {
        iExpect.htmlWith200Status(err, res);

        // eslint-disable-next-line no-unused-expressions
        expect(res).to.redirect;
        expect(res.req.path).to.equal(`${constants.SITE_ROOT}/find-help`);
        done();
      });
  });

  it('/finder should redirect to find help page', (done) => {
    chai.request(server)
      .get(constants.SITE_ROOT)
      .end((err, res) => {
        iExpect.htmlWith200Status(err, res);

        // eslint-disable-next-line no-unused-expressions
        expect(res).to.redirect;
        expect(res.req.path).to.equal(`${constants.SITE_ROOT}/find-help`);
        done();
      });
  });
});

describe('An unknown page', () => {
  it('should return a 404', (done) => {
    chai.request(server)
      .get(`${constants.SITE_ROOT}/not-known`)
      .end((err, res) => {
        expect(err).to.not.be.equal(null);
        expect(res).to.have.status(404);
        // eslint-disable-next-line no-unused-expressions
        expect(res).to.be.html;

        const $ = cheerio.load(res.text);

        expect($('.local-header--title--question').text().trim())
          .to.equal('Page not found');
        done();
      });
  });
});

describe('The stomach ache page', () => {
  it('should be accessible directly', (done) => {
    chai.request(server)
      .get(`${constants.SITE_ROOT}/stomach-ache`)
      .end((err, res) => {
        iExpect.htmlWith200Status(err, res);

        const $ = cheerio.load(res.text);

        expect($('.local-header--title').text())
          .to.equal('Stomach ache');
        done();
      });
  });
});

describe('The find help page', () => {
  describe('with a context of stomach ache', () => {
    it('should contain content for finding help with stomach ache and a postcode input', (done) => {
      chai.request(server)
        .get(`${constants.SITE_ROOT}/find-help`)
        .query({ context: 'stomach-ache' })
        .end((err, res) => {
          iExpect.htmlWith200Status(err, res);

          const $ = cheerio.load(res.text);

          expect($('.page-section').text()).to.contain('For help with');
          iExpect.findHelpPage($);
          done();
        });
    });
  });

  describe('with no context', () => {
    it('should contain no additional content beyond the title and a postcode input', (done) => {
      chai.request(server)
        .get(`${constants.SITE_ROOT}/find-help`)
        .end((err, res) => {
          iExpect.htmlWith200Status(err, res);

          const $ = cheerio.load(res.text);

          expect($('.page-section').text()).to.not.contain('For help with');
          iExpect.findHelpPage($);
          done();
        });
    });
  });

  describe('with an unknown context', () => {
    it('should contain no additional content beyond the title and a postcode input', (done) => {
      chai.request(server)
        .get(`${constants.SITE_ROOT}/find-help`)
        .query({ context: 'unknown' })
        .end((err, res) => {
          iExpect.htmlWith200Status(err, res);

          const $ = cheerio.load(res.text);

          expect($('.page-section').text()).to.not.contain('For help with');
          iExpect.findHelpPage($);
          done();
        });
    });
  });
});

describe('The results page happy paths', () => {
  const postcode = 'AB123CD';
  const postcodeioResponse = getSampleResponse('postcodesio-responses/ls27ue.json');
  const resultsRoute = `${constants.SITE_ROOT}/results`;

  nock('https://api.postcodes.io')
    .get(/.*/)
    .times(4)
    .reply(200, postcodeioResponse);

  describe('happy paths', () => {
    describe('with no or unknown context', () => {
      it('should return 3 open results, by default', (done) => {
        chai.request(server)
          .get(resultsRoute)
          .query({ location: postcode })
          .end((err, res) => {
            iExpect.htmlWith200Status(err, res);
            const $ = cheerio.load(res.text);

            expect($('.local-header--title--question').text())
              .to.equal(`Pharmacies near to '${postcode}'`);
            // Use something that every result with have in order to count them
            const mapLinks = $('.cta-blue');
            expect(mapLinks.length).to.equal(3);
            mapLinks.toArray().forEach((link) => {
              expect($(link).attr('href')).to.have.string('https://maps.google.com');
            });
            expect($('.list-tab__link').attr('href'))
              .to.equal(`${constants.SITE_ROOT}/results?location=${postcode}&open=false&context=`);
            done();
          });
      });

      it('should return 10 results', (done) => {
        chai.request(server)
          .get(resultsRoute)
          .query({ location: postcode, open: false })
          .end((err, res) => {
            iExpect.htmlWith200Status(err, res);
            const $ = cheerio.load(res.text);

            expect($('.local-header--title--question').text())
              .to.equal(`Pharmacies near to '${postcode}'`);
            // Use something that every result with have in order to count them
            const mapLinks = $('.cta-blue');
            expect(mapLinks.length).to.equal(10);
            mapLinks.toArray().forEach((link) => {
              expect($(link).attr('href')).to.have.string('https://maps.google.com');
            });
            expect($('.list-tab__link').attr('href'))
              .to.equal(`${constants.SITE_ROOT}/results?location=${postcode}&open=true&context=`);
            done();
          });
      });
    });

    describe('with context of stomach ache', () => {
      const context = 'stomach-ache';

      it('should return 3 open results, by default', (done) => {
        chai.request(server)
          .get(resultsRoute)
          .query({ location: postcode, context })
          .end((err, res) => {
            iExpect.htmlWith200Status(err, res);
            const $ = cheerio.load(res.text);

            expect($('.local-header--title--question').text())
              .to.equal(`Pharmacies that can help you near to '${postcode}'`);
            // Use something that every result with have in order to count them
            const mapLinks = $('.cta-blue');
            expect(mapLinks.length).to.equal(3);
            mapLinks.toArray().forEach((link) => {
              expect($(link).attr('href')).to.have.string('https://maps.google.com');
            });
            const expectedHref =
              `${constants.SITE_ROOT}/results?location=${postcode}&open=false&context=${context}`;
            expect($('.list-tab__link').attr('href')).to.equal(expectedHref);
            done();
          });
      });

      it('should return 10 results', (done) => {
        chai.request(server)
          .get(resultsRoute)
          .query({ location: postcode, open: false, context: 'stomach-ache' })
          .end((err, res) => {
            iExpect.htmlWith200Status(err, res);
            const $ = cheerio.load(res.text);

            expect($('.local-header--title--question').text())
              .to.equal(`Pharmacies that can help you near to '${postcode}'`);
            // Use something that every result with have in order to count them
            const mapLinks = $('.cta-blue');
            expect(mapLinks.length).to.equal(10);
            mapLinks.toArray().forEach((link) => {
              expect($(link).attr('href')).to.have.string('https://maps.google.com');
            });
            const expectedHref =
              `${constants.SITE_ROOT}/results?location=${postcode}&open=true&context=${context}`;
            expect($('.list-tab__link').attr('href')).to.equal(expectedHref);
            done();
          });
      });
    });
  });
});

describe('The results page error handling', () => {
  describe('with a context', () => {
    const notFoundResponse = getSampleResponse('postcodesio-responses/404.json');
    const resultsRoute = `${constants.SITE_ROOT}/results`;
    const context = 'stomach-ache';

    it('should lookup a valid but unknown postcode and return an error with the help context',
        (done) => {
          const invalidPostcodePassingRegex = 'LS0';
          const postcodesioScope =
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

              expect($('.page-section').text()).to.contain('For help with');
              iExpect.findHelpPage($);
              expect(res.text).to
                .contain(messages.invalidPostcodeMessage(invalidPostcodePassingRegex));
              expect(postcodesioScope.isDone()).to.equal(true);
              done();
            });
        });

    it('should validate the postcode and return an error along with the help context',
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

              expect($('.page-section').text()).to.contain('For help with');
              iExpect.findHelpPage($);
              expect(res.text).to.contain(errorMessage);
              done();
            });
        });

    it('postcode server error should return an error', (done) => {
      const postcode = 'AB123CD';
      const postcodesioScope =
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
          expect(postcodesioScope.isDone()).to.equal(true);
          done();
        });
    });
  });

  describe('with no context', () => {
    const notFoundResponse = getSampleResponse('postcodesio-responses/404.json');
    const resultsRoute = `${constants.SITE_ROOT}/results`;

    it('should lookup a syntactically valid but unknown postcode and return an error message',
      (done) => {
        const invalidPostcodePassingRegex = 'LS0';
        const postcodesioScope =
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
            expect(postcodesioScope.isDone()).to.equal(true);
            done();
          });
      });

    it('should validate the postcode and return an error message', (done) => {
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

    it('postcode server error should return an error', (done) => {
      const postcode = 'AB123CD';
      const postcodesioScope =
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
          expect(postcodesioScope.isDone()).to.equal(true);
          done();
        });
    });
  });
});
