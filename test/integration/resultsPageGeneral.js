const chai = require('chai');
const chaiHttp = require('chai-http');
const cheerio = require('cheerio');
const nock = require('nock');

const constants = require('../../app/lib/constants');
const getSampleResponse = require('../resources/getSampleResponse');
const iExpect = require('../lib/expectations');
const messages = require('../../app/lib/messages');
const server = require('../../server');

const expect = chai.expect;

chai.use(chaiHttp);

const resultsRoute = `${constants.SITE_ROOT}/results`;

describe('The results page', () => {
  const serviceApiResponse = getSampleResponse('service-api-responses/-1,54.json');
  const location = 'Midsomer';
  const latitude = 54;
  const longitude = -1;
  const numberOfNearbyResults = constants.api.nearbyResultsCount;
  const numberOfOpenResults = constants.api.openResultsCount;

  afterEach('clean nock', () => {
    nock.cleanAll();
  });

  describe('generally', () => {
    let $;

    before('run request', async () => {
      nock(process.env.API_BASE_URL)
        .get(`/nearby?latitude=${latitude}&longitude=${longitude}&limits:results=${numberOfNearbyResults}`)
        .times(1)
        .reply(200, serviceApiResponse);

      const res = await chai.request(server)
        .get(resultsRoute)
        .query({ latitude, location, longitude });
      iExpect.htmlWith200Status(res);
      $ = cheerio.load(res.text);
    });

    it('should return distance away singularly for 1 mile and plurally for other distances', () => {
      const firtResultTitle = $('.results__name').eq(0).text();
      const secondResultTitle = $('.results__name').eq(1).text();
      expect($('.distance').eq(0).text()).to.equal(`${firtResultTitle} is 0 miles away`);
      expect($('.distance').eq(1).text()).to.equal(`${secondResultTitle} is 1 mile away`);
    });

    it('should provide a link to see open pharmacies by default', () => {
      const toggle = $('.viewToggle a');
      expect(toggle.attr('href')).to.equal(`/find-a-pharmacy/results?latitude=${latitude}&location=${location}&longitude=${longitude}&open=true`);
    });

    it('should provide a link to see nearby only pharmacies when viewing open pharmacies', async () => {
      nock(process.env.API_BASE_URL)
        .get(`/open?latitude=${latitude}&longitude=${longitude}&limits:results=${numberOfOpenResults}`)
        .times(1)
        .reply(200, serviceApiResponse);

      const res = await chai.request(server)
        .get(resultsRoute)
        .query({
          latitude, location, longitude, open: true,
        });

      iExpect.htmlWith200Status(res);
      $ = cheerio.load(res.text);

      const toggle = $('.viewToggle a');
      expect(toggle.attr('href')).to.equal(`/find-a-pharmacy/results?latitude=${latitude}&location=${location}&longitude=${longitude}&open=false`);
    });

    it('should handle an error from the api', async () => {
      const apiErrorResponse = getSampleResponse('service-api-responses/err.json');
      nock(process.env.API_BASE_URL)
        .get(`/nearby?latitude=${latitude}&longitude=${longitude}&limits:results=${numberOfNearbyResults}`)
        .times(1)
        .reply(500, apiErrorResponse);

      try {
        await chai.request(server)
          .get(resultsRoute)
          .query({ latitude, location, longitude });
      } catch (err) {
        expect(err).to.have.status(500);
        expect(err.response).to.be.html;

        $ = cheerio.load(err.response.text);
        expect($('.local-header--title--question').text())
          .to.contain(messages.technicalProblems());
      }
    });
  });

  describe('opening times display', () => {
    const daysOfWeek = constants.daysOfWeekOrderedForUi;
    const timesResponse = getSampleResponse('service-api-responses/OX201TF.json');
    const timesLocation = 'OX201TF';
    const timesLatitude = 51.8470068238121;
    const timesLongitude = -1.35519245281661;
    let $;

    before('run request', async () => {
      nock(process.env.API_BASE_URL)
        .get(`/nearby?latitude=${timesLatitude}&longitude=${timesLongitude}&limits:results=${numberOfOpenResults}`)
        .times(1)
        .reply(200, timesResponse);

      const res = await chai.request(server)
        .get(resultsRoute)
        .query({
          latitude: timesLatitude,
          location: timesLocation,
          longitude: timesLongitude,
        });

      iExpect.htmlWith200Status(res);
      $ = cheerio.load(res.text);
    });

    it('should remove opening times block when there are no opening times', () => {
      const resultsWithTimes = $('section:has(details)');
      const resultsWithOutTimes = $('section:not(:has(details))');

      expect(resultsWithTimes.length).to.equal(9);
      expect(resultsWithOutTimes.length).to.equal(1);
    });

    it('should display a row for each day of the week', () => {
      const numberOfResultsWithTimes = 9;
      const daysInWeek = 7;
      const headerRow = 1;
      const expectedDayAndHeaderRows = (headerRow + daysInWeek) * numberOfResultsWithTimes;

      const dayAndHeaderRows = $('tr:not(.hasSessions)');
      expect(dayAndHeaderRows.length).to.equal(expectedDayAndHeaderRows);
      dayAndHeaderRows.each((i) => {
        const dayName = dayAndHeaderRows.eq(i).children('th').text();
        switch (i % 8) {
          case 1:
            expect(dayName).to.equal(daysOfWeek[0]);
            break;
          case 2:
            expect(dayName).to.equal(daysOfWeek[1]);
            break;
          case 3:
            expect(dayName).to.equal(daysOfWeek[2]);
            break;
          case 4:
            expect(dayName).to.equal(daysOfWeek[3]);
            break;
          case 5:
            expect(dayName).to.equal(daysOfWeek[4]);
            break;
          case 6:
            expect(dayName).to.equal(daysOfWeek[5]);
            break;
          case 7:
            expect(dayName).to.equal(daysOfWeek[6]);
            break;
          default:
            break;
        }
      });
    });

    it('should display a row for each session', () => {
      const resultWithSessions = $('section:has(details)').eq(1).find('tr');
      expect(resultWithSessions.length).to.equal(13);
      expect(resultWithSessions.eq(11).find('th').text()).to.equal(daysOfWeek[5]);
      expect(resultWithSessions.eq(11).find('td').text()).to.equal('Closed');
      expect(resultWithSessions.eq(12).find('th').text()).to.equal(daysOfWeek[6]);
      expect(resultWithSessions.eq(12).find('td').text()).to.equal('Closed');
    });

    it('should have a link to the open results page when the pharmacy is closed', () => {
      const linksToOpenResultsPage = $('.openingTimes__openResults');

      expect(linksToOpenResultsPage.length).to.equal(3);
      linksToOpenResultsPage.each((index, element) => {
        expect($(element).attr('href')).to.equal(`/find-a-pharmacy/results?latitude=${timesLatitude}&location=${timesLocation}&longitude=${timesLongitude}&open=true`);
      });
    });
  });
});
