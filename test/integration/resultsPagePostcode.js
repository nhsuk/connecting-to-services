const chai = require('chai');
const chaiHttp = require('chai-http');
const cheerio = require('cheerio');
const nock = require('nock');

const constants = require('../../app/lib/constants');
const getSampleResponse = require('../resources/getSampleResponse');
const iExpect = require('../lib/expectations');
const messages = require('../../app/lib/messages');
const postcodesIOURL = require('../lib/constants').postcodesIOURL;
const server = require('../../server');
const nockRequests = require('../lib/nockRequests');
const queryBuilder = require('../../app/lib/queryBuilder');

const expect = chai.expect;
const queryTypes = constants.queryTypes;

chai.use(chaiHttp);

const resultsRoute = `${constants.siteRoot}/results`;
const nearbyResultsCount = constants.api.nearbyResultsCount;
const appTitle = constants.app.title;

describe('The results page', () => {
  after('clean nock', () => {
    nock.cleanAll();
  });

  const ls27ue = 'LS2 7UE';
  const ls27ueResponse = getSampleResponse('postcodesio-responses/ls27ue.json');
  const ls27ueResult = JSON.parse(ls27ueResponse).result;

  it('should return 10 nearby results, by default', async () => {
    const searchOrigin = {
      latitude: ls27ueResult.latitude,
      longitude: ls27ueResult.longitude,
    };

    nock(postcodesIOURL)
      .get(`/postcodes/${encodeURIComponent(ls27ue)}`)
      .times(1)
      .reply(200, ls27ueResponse);

    const body = queryBuilder(searchOrigin, { queryType: queryTypes.nearby });
    await nockRequests.serviceSearch(body, 200, 'organisations/LS27UE-as.json');

    const res = await chai.request(server)
      .get(resultsRoute)
      .query({ location: ls27ue });

    iExpect.htmlWith200Status(res);
    const $ = cheerio.load(res.text);

    expect($('h1').text()).to.equal(`Pharmacies near ${ls27ue}`);

    const results = $('.results__item');
    expect(results.length).to.equal(nearbyResultsCount);

    const mapLinks = $('.maplink');
    expect(mapLinks.length).to.equal(10);
    mapLinks.toArray().forEach((link) => {
      expect($(link).attr('href')).to.have.string('https://maps.google.com/maps?daddr=');
      expect($(link).attr('href')).to.have.string(`&saddr=${encodeURIComponent(ls27ue)}`);
    });

    expect($('head title').text()).to.equal('Pharmacies near LS2 7UE - NHS');
    iExpect.resultsPageBreadcrumb($);
    iExpect.call111Callout($);
  });

  it('should return 10 open results', async () => {
    const numberOfResults = constants.api.nearbyResultsCount;
    const searchOrigin = {
      latitude: ls27ueResult.latitude,
      longitude: ls27ueResult.longitude,
    };

    nock(postcodesIOURL)
      .get(`/postcodes/${encodeURIComponent(ls27ue)}`)
      .times(1)
      .reply(200, ls27ueResponse);

    const body = queryBuilder(searchOrigin, { queryType: queryTypes.openNearby });
    await nockRequests.serviceSearch(body, 200, 'organisations/LS27UE-as.json');

    const res = await chai.request(server)
      .get(resultsRoute)
      .query({ location: ls27ue, open: true });

    iExpect.htmlWith200Status(res);
    const $ = cheerio.load(res.text);

    expect($('h1').text()).to.equal(`Pharmacies near ${ls27ue}`);

    const results = $('.results__item');
    expect(results.length).to.equal(numberOfResults);

    const mapLinks = $('.maplink');
    expect(mapLinks.length).to.equal(10);
    mapLinks.toArray().forEach((link) => {
      expect($(link).attr('href')).to.have.string('https://maps.google.com/maps?daddr=');
      expect($(link).attr('href')).to.have.string(`&saddr=${encodeURIComponent(ls27ue)}`);
    });

    expect($('head title').text()).to.equal('Pharmacies near LS2 7UE - NHS');
    iExpect.resultsPageBreadcrumb($);
    iExpect.call111Callout($);
  });

  it('should display no pharmacies, formatted postcode, and country specific message for known non-english postcodes', async () => {
    const outcode = 'bt1';
    const outcodeFormatted = 'BT1';

    const postcodeResponse = getSampleResponse('postcodesio-responses/bt1.json');
    nock(postcodesIOURL)
      .get(`/outcodes/${outcodeFormatted}`)
      .times(1)
      .reply(200, postcodeResponse);

    const res = await chai.request(server)
      .get(resultsRoute)
      .query({ location: outcode });

    iExpect.htmlWith200Status(res);
    const $ = cheerio.load(res.text);

    expect($('.results__header--none').text()).to.equal(`We can't find any pharmacies near ${outcodeFormatted}`);
    expect($('.results__none-content p').length).to.equal(2);
    expect($('.results__none-content p a').text()).to.equal('Find pharmacies in Northern Ireland on the Health and Social Care website');

    expect($('.results__none-content').text()).to
      .contain('This service only provides information about pharmacies in England.');
    expect($('.results__none-content').text()).to.not
      .contain('If you need a pharmacy in Scotland, Wales, Northern Ireland or the Isle of Man, you can use one of the following websites.');
    expect($('head title').text()).to.equal(`${appTitle} - We can't find any pharmacies near BT1 - NHS`);
    iExpect.noResultsPageBreadcrumb($);
  });

  it('should display no pharmacies, and no onward journey for postcode not in England, Scotland, Wales or Northern Ireland', async () => {
    const outcode = 'im1';
    const outcodeFormatted = 'IM1';

    const postcodeResponse = getSampleResponse('postcodesio-responses/im1.json');
    nock(postcodesIOURL)
      .get(`/outcodes/${outcodeFormatted}`)
      .times(1)
      .reply(200, postcodeResponse);

    const res = await chai.request(server)
      .get(resultsRoute)
      .query({ location: outcode });

    iExpect.htmlWith200Status(res);
    const $ = cheerio.load(res.text);

    expect($('.results__header--none').text()).to.equal(`We can't find any pharmacies near ${outcodeFormatted}`);
    expect($('.results__none-content p').length).to.equal(1);

    expect($('.results__none-content').text()).to
      .contain('This service only provides information about pharmacies in England.');
    expect($('.results__none-content').text()).to.not
      .contain('If you need a pharmacy in Scotland, Wales, Northern Ireland or the Isle of Man, you can use one of the following websites.');
    expect($('head title').text()).to.equal(`${appTitle} - We can't find any pharmacies near IM1 - NHS`);
    iExpect.noResultsPageBreadcrumb($);
  });

  it('should display a message when there are no open pharmacies', async () => {
    const outcode = 'BA3';
    const postcodeResponse = getSampleResponse('postcodesio-responses/BA3.json');
    const searchOrigin = {
      latitude: JSON.parse(postcodeResponse).result.latitude,
      longitude: JSON.parse(postcodeResponse).result.longitude,
    };

    nock(postcodesIOURL)
      .get(`/outcodes/${outcode}`)
      .times(1)
      .reply(200, postcodeResponse);

    const body = queryBuilder(searchOrigin, { queryType: queryTypes.openNearby });
    await nockRequests.serviceSearch(body, 200, 'organisations/empty-as.json');

    const res = await chai.request(server)
      .get(resultsRoute)
      .query({ location: outcode, open: true });

    iExpect.htmlWith200Status(res);
    const $ = cheerio.load(res.text);

    expect($('.results__header--none').text()).to
      .equal(`We can't find any pharmacies near ${outcode}`);
    expect($('.results__none-content').text()).to
      .contain('This service only provides information about pharmacies in England.');
    expect($('.results__none-content').text()).to.not
      .contain('If you need a pharmacy in Scotland, Wales, Northern Ireland or the Isle of Man, you can use one of the following websites.');
    iExpect.noResultsPageBreadcrumb($);
  });

  it('should display a message when there are no nearby pharmacies', async () => {
    const outcode = 'BA3';
    const postcodeResponse = getSampleResponse('postcodesio-responses/BA3.json');
    const searchOrigin = {
      latitude: JSON.parse(postcodeResponse).result.latitude,
      longitude: JSON.parse(postcodeResponse).result.longitude,
    };

    nock(postcodesIOURL)
      .get(`/outcodes/${outcode}`)
      .times(1)
      .reply(200, postcodeResponse);

    const body = queryBuilder(searchOrigin, { queryType: queryTypes.nearby });
    await nockRequests.serviceSearch(body, 200, 'organisations/empty-as.json');

    const res = await chai.request(server)
      .get(resultsRoute)
      .query({ location: outcode });

    iExpect.htmlWith200Status(res);
    const $ = cheerio.load(res.text);

    expect($('.results__header--none').text()).to
      .equal(`We can't find any pharmacies near ${outcode}`);
    expect($('.results__none-content').text()).to
      .contain('This service only provides information about pharmacies in England.');
    expect($('.results__none-content').text()).to.not
      .contain('If you need a pharmacy in Scotland, Wales, Northern Ireland or the Isle of Man, you can use one of the following websites.');
    iExpect.noResultsPageBreadcrumb($);
  });
});

describe('The results page error handling', () => {
  after('clean nock', () => {
    nock.cleanAll();
  });

  const notFoundResponse = getSampleResponse('postcodesio-responses/404.json');

  it(
    'should lookup a valid but unknown postcode and return an error message with postcode in uppercase',
    async () => {
      const unknownPostcode = 'ls0';
      const unknownPostcodeUppercase = 'LS0';

      nock(postcodesIOURL)
        .get(`/outcodes/${unknownPostcodeUppercase}`)
        .times(1)
        .reply(404, notFoundResponse);

      const res = await chai.request(server)
        .get(resultsRoute)
        .query({ location: unknownPostcode });

      iExpect.htmlWith200Status(res);
      const $ = cheerio.load(res.text);

      expect($('.error-summary-heading').text()).to
        .contain(`We can't find the postcode '${unknownPostcodeUppercase}'`);
      expect($('head title').text()).to.equal(`${appTitle} - We can't find the postcode '${unknownPostcodeUppercase}' - NHS`);
      expect($('label.nhsuk-heading-m').text()).to.equal('Enter a town, city or postcode in England');
    }
  );

  it('should handle an error produced by the postcode lookup and return an error message', async () => {
    const postcode = 'AB12 3CD';

    nock(postcodesIOURL)
      .get(`/postcodes/${encodeURIComponent(postcode)}`)
      .times(1)
      .reply(500);

    try {
      await chai.request(server)
        .get(resultsRoute)
        .query({ location: postcode });
    } catch (err) {
      expect(err).to.have.status(500);
      expect(err.response).to.be.html;

      const $ = cheerio.load(err.response.text);

      expect($('.page-section').text()).to.not.contain('For help with');
      expect($('.nhsuk-page-heading').text())
        .to.contain(messages.technicalProblems());
      expect($('head title').text())
        .to.equal('Sorry, we are experiencing technical problems - NHS');
    }
  });

  it('should handle the pharmacy service when it responds with a 500 response with an error message', async () => {
    const fakePostcode = 'FA12 3KE';
    const fakeResponse = getSampleResponse('postcodesio-responses/fake.json');

    nock(postcodesIOURL)
      .get(`/postcodes/${encodeURIComponent(fakePostcode)}`)
      .times(1)
      .reply(200, fakeResponse);

    await nockRequests.serviceSearch({}, 500, 'organisations/err-as.json');

    try {
      await chai.request(server)
        .get(resultsRoute)
        .query({ location: fakePostcode });
    } catch (err) {
      expect(err).to.have.status(500);
      expect(err.response).to.be.html;

      const $ = cheerio.load(err.response.text);

      expect($('.page-section').text()).to.not.contain('For help with');
      expect($('.nhsuk-page-heading').text())
        .to.contain(messages.technicalProblems());
    }
  });

  it('should handle a response from the pharmacy service when there has been an error based on the input', async () => {
    const badPostcode = 'BA40 0AD';
    const badResponse = getSampleResponse('postcodesio-responses/bad.json');

    nock(postcodesIOURL)
      .get(`/postcodes/${encodeURIComponent(badPostcode)}`)
      .times(1)
      .reply(200, badResponse);

    await nockRequests.serviceSearch({}, 400, 'organisations/err-as.json');

    try {
      await chai.request(server)
        .get(resultsRoute)
        .query({ location: badPostcode });
    } catch (err) {
      expect(err).to.have.status(500);
      expect(err.response).to.be.html;

      const $ = cheerio.load(err.response.text);

      expect($('.page-section').text()).to.not.contain('For help with');
      expect($('.nhsuk-page-heading').text())
        .to.contain(messages.technicalProblems());
    }
  });

  it('it should handle the pharmacy service being unavailable with an error message', async () => {
    const outcode = 'BH1';
    const postcodesResponse = getSampleResponse('postcodesio-responses/bh1.json');

    nock(postcodesIOURL)
      .get(`/outcodes/${outcode}`)
      .times(1)
      .reply(200, postcodesResponse);

    nockRequests.serviceSearchUnavailable('service unavailable');

    try {
      await chai.request(server)
        .get(resultsRoute)
        .query({ location: outcode });
    } catch (err) {
      expect(err).to.have.status(500);
      expect(err.response).to.be.html;

      const $ = cheerio.load(err.response.text);

      expect($('.page-section').text()).to.not.contain('For help with');
      expect($('.nhsuk-page-heading').text())
        .to.contain(messages.technicalProblems());
    }
  });
});
