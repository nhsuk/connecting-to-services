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
    it('should have a link back to the Choices pharmacy finder', () => {
      nock(process.env.API_BASE_URL)
        .get(`/nearby?latitude=${latitude}&longitude=${longitude}&limits:results=${numberOfNearbyResults}`)
        .times(1)
        .reply(200, serviceApiResponse);

      return chai.request(server)
        .get(resultsRoute)
        .query({ location, latitude, longitude })
        .then((res) => {
          const $ = cheerio.load(res.text);

          expect($('.back-to-choices').attr('href'))
            .to.equal('https://www.nhs.uk/Service-Search/Pharmacy/LocationSearch/10?nobeta=true');
        })
        .catch((err) => { throw err; });
    });

    it('should return distance away singularly for 1 mile and pluraly for other distances', () => {
      nock(process.env.API_BASE_URL)
        .get(`/nearby?latitude=${latitude}&longitude=${longitude}&limits:results=${numberOfNearbyResults}`)
        .times(1)
        .reply(200, serviceApiResponse);

      return chai.request(server)
        .get(resultsRoute)
        .query({ location, latitude, longitude })
        .then((res) => {
          iExpect.htmlWith200Status(res);
          const $ = cheerio.load(res.text);
          expect($('.distance').eq(0).text()).to.equal('0 miles away');
          expect($('.distance').eq(1).text()).to.equal('1 mile away');
          expect($('.back-to-choices').attr('href'))
            .to.equal('https://www.nhs.uk/Service-Search/Pharmacy/LocationSearch/10?nobeta=true');
        })
        .catch((err) => { throw err; });
    });

    it('should provide a link to see open pharmacies by default', () => {
      nock(process.env.API_BASE_URL)
        .get(`/nearby?latitude=${latitude}&longitude=${longitude}&limits:results=${numberOfNearbyResults}`)
        .times(1)
        .reply(200, serviceApiResponse);

      return chai.request(server)
        .get(resultsRoute)
        .query({ location, latitude, longitude })
        .then((res) => {
          iExpect.htmlWith200Status(res);
          const $ = cheerio.load(res.text);
          const toggle = $('.viewToggle a');
          expect(toggle.attr('class')).to.equal('');
          expect(toggle.attr('href')).to.have.string('&open=true');
        })
        .catch((err) => { throw err; });
    });

    it('should provide a link to see nearby only pharmacies when viewing open pharmacies', () => {
      nock(process.env.API_BASE_URL)
        .get(`/open?latitude=${latitude}&longitude=${longitude}&limits:results=${numberOfOpenResults}`)
        .times(1)
        .reply(200, serviceApiResponse);

      return chai.request(server)
        .get(resultsRoute)
        .query({
          location, latitude, longitude, open: true
        })
        .then((res) => {
          iExpect.htmlWith200Status(res);
          const $ = cheerio.load(res.text);
          const toggle = $('.viewToggle a');
          expect(toggle.attr('class')).to.equal('checked');
          expect(toggle.attr('href')).to.have.string('&open=false');
        })
        .catch((err) => { throw err; });
    });

    it('should handle an error from the api', () => {
      const apiErrorResponse = getSampleResponse('service-api-responses/err.json');
      nock(process.env.API_BASE_URL)
        .get(`/nearby?latitude=${latitude}&longitude=${longitude}&limits:results=${numberOfNearbyResults}`)
        .times(1)
        .reply(500, apiErrorResponse);

      return chai.request(server)
        .get(resultsRoute)
        .query({ location, latitude, longitude })
        .then((res) => {
          expect(res).to.have.status(500);
          expect(res).to.be.html;

          const $ = cheerio.load(res.text);
          expect($('.local-header--title--question').text())
            .to.contain(messages.technicalProblems());
        })
        .catch((err) => {
          expect(err).to.not.be.null;
        });
    });
  });

  describe('opening times display', () => {
    const timesResponse = getSampleResponse('service-api-responses/OX201TF.json');
    const timesLocation = 'OX201TF';
    const timesLatitude = 51.8470068238121;
    const timesLongitude = -1.35519245281661;

    it('should remove opening times block when there are no opening times', () => {
      nock(process.env.API_BASE_URL)
        .get(`/nearby?latitude=${timesLatitude}&longitude=${timesLongitude}&limits:results=${numberOfOpenResults}`)
        .times(1)
        .reply(200, timesResponse);

      return chai.request(server)
        .get(resultsRoute)
        .query({
          location: timesLocation,
          latitude: timesLatitude,
          longitude: timesLongitude,
        })
        .then((res) => {
          iExpect.htmlWith200Status(res);
          const $ = cheerio.load(res.text);
          const resultsWithTimes = $('section:has(details)');
          const resultsWithOutTimes = $('section:not(:has(details))');

          expect(resultsWithTimes.length).to.equal(9);
          expect(resultsWithOutTimes.length).to.equal(1);
        })
        .catch((err) => { throw err; });
    });

    it('should display a row for each day of the week and a row for each session', () => {
      nock(process.env.API_BASE_URL)
        .get(`/nearby?latitude=${timesLatitude}&longitude=${timesLongitude}&limits:results=${numberOfOpenResults}`)
        .times(1)
        .reply(200, timesResponse);

      const numberOfResultsWithTimes = 9;
      const daysInWeek = 7;
      const headerRow = 1;
      const expectedDayAndHeaderRows = (headerRow + daysInWeek) * numberOfResultsWithTimes;
      const daysOfWeek = constants.daysOfWeekOrderedForUi;

      return chai.request(server)
        .get(resultsRoute)
        .query({
          location: timesLocation,
          latitude: timesLatitude,
          longitude: timesLongitude,
        })
        .then((res) => {
          iExpect.htmlWith200Status(res);
          const $ = cheerio.load(res.text);
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
          // Check result with sessions
          const resultWithSessions = $('section:has(details)').eq(1).find('tr');
          expect(resultWithSessions.length).to.equal(13);
          expect(resultWithSessions.eq(11).find('th').text()).to.equal(daysOfWeek[5]);
          expect(resultWithSessions.eq(11).find('td').text()).to.equal('Closed');
          expect(resultWithSessions.eq(12).find('th').text()).to.equal(daysOfWeek[6]);
          expect(resultWithSessions.eq(12).find('td').text()).to.equal('Closed');
        })
        .catch((err) => { throw err; });
    });
  });
});
