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
const nearbyResultsCount = constants.api.nearbyResultsCount;

describe('The results page', () => {
  after('clean nock', () => {
    nock.cleanAll();
  });

  const ls27ue = 'LS2 7UE';
  const ls27ueResponse = getSampleResponse('postcodesio-responses/ls27ue.json');
  const serviceApiResponse = getSampleResponse('service-api-responses/-1,54.json');
  const ls27ueResult = JSON.parse(ls27ueResponse).result;

  it('should return 10 nearby results, by default', () => {
    const latitude = ls27ueResult.latitude;
    const longitude = ls27ueResult.longitude;

    nock('https://api.postcodes.io')
      .get(`/postcodes/${encodeURIComponent(ls27ue)}`)
      .times(1)
      .reply(200, ls27ueResponse);

    nock(process.env.API_BASE_URL)
      .get(`/nearby?latitude=${latitude}&longitude=${longitude}&limits:results=${nearbyResultsCount}`)
      .times(1)
      .reply(200, serviceApiResponse);

    return chai.request(server)
      .get(resultsRoute)
      .query({ location: ls27ue })
      .then((res) => {
        iExpect.htmlWith200Status(res);
        const $ = cheerio.load(res.text);

        expect($('h1').text()).to.equal(`Pharmacies near ${ls27ue}`);

        const results = $('.results__item');
        expect(results.length).to.equal(nearbyResultsCount);

        const mapLinks = $('.results__maplink');
        mapLinks.toArray().forEach((link) => {
          expect($(link).attr('href')).to.have.string(`https://maps.google.com/maps?saddr=${encodeURIComponent(ls27ue)}`);
        });

        expect($('title').text()).to.equal('Pharmacies near LS2 7UE - NHS.UK');
        iExpect.resultsPageBreadcrumb($);
        iExpect.call111Callout($);
      })
      .catch((err) => { throw err; });
  });

  it('should return 10 open results', () => {
    const numberOfResults = constants.api.nearbyResultsCount;
    const latitude = ls27ueResult.latitude;
    const longitude = ls27ueResult.longitude;

    nock('https://api.postcodes.io')
      .get(`/postcodes/${encodeURIComponent(ls27ue)}`)
      .times(1)
      .reply(200, ls27ueResponse);

    nock(process.env.API_BASE_URL)
      .get(`/open?latitude=${latitude}&longitude=${longitude}&limits:results=${numberOfResults}`)
      .times(1)
      .reply(200, serviceApiResponse);

    return chai.request(server)
      .get(resultsRoute)
      .query({ location: ls27ue, open: true })
      .then((res) => {
        iExpect.htmlWith200Status(res);
        const $ = cheerio.load(res.text);

        expect($('h1').text()).to.equal(`Pharmacies near ${ls27ue}`);

        const results = $('.results__item');
        expect(results.length).to.equal(numberOfResults);

        const mapLinks = $('.results__maplink');
        mapLinks.toArray().forEach((link) => {
          expect($(link).attr('href')).to.have.string(`https://maps.google.com/maps?saddr=${encodeURIComponent(ls27ue)}`);
        });

        expect($('title').text()).to.equal('Pharmacies near LS2 7UE - NHS.UK');
        iExpect.resultsPageBreadcrumb($);
        iExpect.call111Callout($);
      })
      .catch((err) => { throw err; });
  });

  it('should display no pharmacies, formatted postcode, and country specific message for known non-english postcodes', () => {
    const outcode = 'bt1';
    const outcodeFormatted = 'BT1';

    const postcodeResponse = getSampleResponse('postcodesio-responses/bt1.json');
    nock('https://api.postcodes.io')
      .get(`/outcodes/${outcodeFormatted}`)
      .times(1)
      .reply(200, postcodeResponse);

    return chai.request(server)
      .get(resultsRoute)
      .query({ location: outcode })
      .then((res) => {
        iExpect.htmlWith200Status(res);
        const $ = cheerio.load(res.text);

        expect($('.results__header--none').text()).to.equal(`We can't find any pharmacies near ${outcodeFormatted}`);
        expect($('.results__none-content p').length).to.equal(2);
        expect($('.results__none-content p a').text()).to.equal('Find pharmacies in Northern Ireland on the Health and Social Care website');

        expect($('.results__none-content').text()).to
          .contain('This service only provides information about pharmacies in England.');
        expect($('.results__none-content').text()).to.not
          .contain('If you need a pharmacy in Scotland, Wales, Northern Ireland or the Isle of Man, you can use one of the following websites.');
        expect($('.results-none-nearby').length).to.equal(0);
        expect($('title').text()).to.equal('Find a pharmacy - We can\'t find any pharmacies near BT1 - NHS.UK');
        iExpect.noResultsPageBreadcrumb($);
      })
      .catch((err) => { throw err; });
  });

  it('should display no pharmacies, and no onward journey for postcode not in England, Scotland, Wales or Northern Ireland', () => {
    const outcode = 'im1';
    const outcodeFormatted = 'IM1';

    const postcodeResponse = getSampleResponse('postcodesio-responses/im1.json');
    nock('https://api.postcodes.io')
      .get(`/outcodes/${outcodeFormatted}`)
      .times(1)
      .reply(200, postcodeResponse);

    return chai.request(server)
      .get(resultsRoute)
      .query({ location: outcode })
      .then((res) => {
        iExpect.htmlWith200Status(res);
        const $ = cheerio.load(res.text);

        expect($('.results__header--none').text()).to.equal(`We can't find any pharmacies near ${outcodeFormatted}`);
        expect($('.results__none-content p').length).to.equal(1);

        expect($('.results__none-content').text()).to
          .contain('This service only provides information about pharmacies in England.');
        expect($('.results__none-content').text()).to.not
          .contain('If you need a pharmacy in Scotland, Wales, Northern Ireland or the Isle of Man, you can use one of the following websites.');
        expect($('.results-none-nearby').length).to.equal(0);
        expect($('title').text()).to.equal('Find a pharmacy - We can\'t find any pharmacies near IM1 - NHS.UK');
        iExpect.noResultsPageBreadcrumb($);
      })
      .catch((err) => { throw err; });
  });

  it('should display a message when there are no open pharmacies', () => {
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
      .get(`/open?latitude=${latitude}&longitude=${longitude}&limits:results=${nearbyResultsCount}`)
      .times(1)
      .reply(200, noResultsResponse);

    return chai.request(server)
      .get(resultsRoute)
      .query({ location: outcode, open: true })
      .then((res) => {
        iExpect.htmlWith200Status(res);
        const $ = cheerio.load(res.text);

        expect($('.results__header--none').text()).to
          .equal(`We can't find any pharmacies near ${outcode}`);
        expect($('.results__none-content').text()).to
          .contain('This service only provides information about pharmacies in England.');
        expect($('.results__none-content').text()).to.not
          .contain('If you need a pharmacy in Scotland, Wales, Northern Ireland or the Isle of Man, you can use one of the following websites.');
        expect($('.results-none-nearby').length).to.equal(0);
        iExpect.noResultsPageBreadcrumb($);
      })
      .catch((err) => { throw err; });
  });

  it('should display a message when there are no nearby pharmacies', () => {
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
      .get(`/nearby?latitude=${latitude}&longitude=${longitude}&limits:results=${nearbyResultsCount}`)
      .times(1)
      .reply(200, noResultsResponse);

    return chai.request(server)
      .get(resultsRoute)
      .query({ location: outcode })
      .then((res) => {
        iExpect.htmlWith200Status(res);
        const $ = cheerio.load(res.text);

        expect($('.results__header--none').text()).to
          .equal(`We can't find any pharmacies near ${outcode}`);
        expect($('.results__none-content').text()).to
          .contain('This service only provides information about pharmacies in England.');
        expect($('.results__none-content').text()).to.not
          .contain('If you need a pharmacy in Scotland, Wales, Northern Ireland or the Isle of Man, you can use one of the following websites.');
        expect($('.results-none-nearby').length).to.equal(0);
        iExpect.noResultsPageBreadcrumb($);
      })
      .catch((err) => { throw err; });
  });
});

describe('The results page error handling', () => {
  after('clean nock', () => {
    nock.cleanAll();
  });

  const notFoundResponse = getSampleResponse('postcodesio-responses/404.json');

  it(
    'should lookup a valid but unknown postcode and return an error message with postcode in uppercase',
    () => {
      const unknownPostcode = 'ls0';
      const unknownPostcodeUppercase = 'LS0';

      nock('https://api.postcodes.io')
        .get(`/outcodes/${unknownPostcodeUppercase}`)
        .times(1)
        .reply(404, notFoundResponse);

      return chai.request(server)
        .get(resultsRoute)
        .query({ location: unknownPostcode })
        .then((res) => {
          iExpect.htmlWith200Status(res);
          const $ = cheerio.load(res.text);

          expect($('.error-summary-heading').text()).to
            .contain(`We can't find the postcode '${unknownPostcodeUppercase}'`);
          expect($('title').text()).to.equal(`Find a pharmacy - We can't find the postcode '${unknownPostcodeUppercase}' - NHS.UK`);
          expect($('.form-label-bold').text()).to.equal('Enter a town, city or postcode in England');
        })
        .catch((err) => { throw err; });
    }
  );

  it('should handle an error produced by the postcode lookup and return an error message', () => {
    const postcode = 'AB12 3CD';

    nock('https://api.postcodes.io')
      .get(`/postcodes/${encodeURIComponent(postcode)}`)
      .times(1)
      .reply(500);

    return chai.request(server)
      .get(resultsRoute)
      .query({ location: postcode })
      .then((res) => {
        expect(res).to.have.status(500);
        expect(res).to.be.html;

        const $ = cheerio.load(res.text);

        expect($('.page-section').text()).to.not.contain('For help with');
        expect($('.local-header--title--question').text())
          .to.contain(messages.technicalProblems());
        expect($('title').text())
          .to.equal('Sorry, we are experiencing technical problems - NHS.UK');
      })
      .catch((err) => {
        expect(err).to.not.be.null;
      });
  });

  it('should handle the pharmacy service when it responds with a 500 response with an error message', () => {
    const fakePostcode = 'FA12 3KE';
    const fakeResponse = getSampleResponse('postcodesio-responses/fake.json');
    const latitude = JSON.parse(fakeResponse).result.latitude;
    const longitude = JSON.parse(fakeResponse).result.longitude;

    nock('https://api.postcodes.io')
      .get(`/postcodes/${encodeURIComponent(fakePostcode)}`)
      .times(1)
      .reply(200, fakeResponse);

    nock(process.env.API_BASE_URL)
      .get(`/nearby?latitude=${latitude}&longitude=${longitude}&limits:results=${nearbyResultsCount}`)
      .reply(500);

    return chai.request(server)
      .get(resultsRoute)
      .query({ location: fakePostcode })
      .then((res) => {
        expect(res).to.have.status(500);
        expect(res).to.be.html;

        const $ = cheerio.load(res.text);

        expect($('.page-section').text()).to.not.contain('For help with');
        expect($('.local-header--title--question').text())
          .to.contain(messages.technicalProblems());
      })
      .catch((err) => {
        expect(err).to.not.be.null;
      });
  });

  it('should handle a response from the pharmacy service when there has been an error based on the input', () => {
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
      .get(`/nearby?latitude=${latitude}&longitude=${longitude}&limits:results=${nearbyResultsCount}`)
      .reply(400, badPharmacyResponse);

    return chai.request(server)
      .get(resultsRoute)
      .query({ location: badPostcode })
      .then((res) => {
        expect(res).to.have.status(500);
        expect(res).to.be.html;

        const $ = cheerio.load(res.text);

        expect($('.page-section').text()).to.not.contain('For help with');
        expect($('.local-header--title--question').text())
          .to.contain(messages.technicalProblems());
      })
      .catch((err) => {
        expect(err).to.not.be.null;
      });
  });

  it('it should handle the pharmacy service being unavailable with an error message', () => {
    const outcode = 'BH1';
    const postcodesResponse = getSampleResponse('postcodesio-responses/bh1.json');
    const latitude = JSON.parse(postcodesResponse).result.latitude;
    const longitude = JSON.parse(postcodesResponse).result.longitude;

    nock('https://api.postcodes.io')
      .get(`/outcodes/${outcode}`)
      .times(1)
      .reply(200, postcodesResponse);

    nock(process.env.API_BASE_URL)
      .get(`/nearby?latitude=${latitude}&longitude=${longitude}&limits:results=${nearbyResultsCount}`)
      .replyWithError({ message: `connect ECONNREFUSED ${process.env.API_BASE_URL}:3001` });

    return chai.request(server)
      .get(resultsRoute)
      .query({ location: outcode })
      .then((res) => {
        expect(res).to.have.status(500);
        expect(res).to.be.html;

        const $ = cheerio.load(res.text);

        expect($('.page-section').text()).to.not.contain('For help with');
        expect($('.local-header--title--question').text())
          .to.contain(messages.technicalProblems());
      })
      .catch((err) => {
        expect(err).to.not.be.null;
      });
  });
});
