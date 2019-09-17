const chai = require('chai');
const chaiHttp = require('chai-http');
const cheerio = require('cheerio');
const nock = require('nock');

const constants = require('../../app/lib/constants');
const iExpect = require('../lib/expectations');
const messages = require('../../app/lib/messages');
const server = require('../../server');
const nockRequests = require('../lib/nockRequests');
const queryBuilder = require('../../app/lib/queryBuilder');
const postcodeCoordinates = require('../resources/postcode-coordinates');

const queryTypes = constants.queryTypes;
const expect = chai.expect;

chai.use(chaiHttp);

const resultsRoute = `${constants.siteRoot}/results`;

describe('The results page', () => {
  afterEach('clean nock', () => {
    nock.cleanAll();
  });

  describe('generally', () => {
    describe('for default results view', () => {
      let $;
      const location = 'Middlesbrough';
      const searchOrigin = postcodeCoordinates.TS55NP;

      before('run request', async () => {
        const body = queryBuilder(searchOrigin, { queryType: queryTypes.nearby });
        await nockRequests.serviceSearch(body, 200, 'organisations/TS55NP-as.json');

        const res = await chai.request(server)
          .get(resultsRoute)
          .query({
            latitude: searchOrigin.latitude,
            location,
            longitude: searchOrigin.longitude,
          });
        iExpect.htmlWith200Status(res);
        $ = cheerio.load(res.text);
      });

      it('should return distance away singularly for 1 mile and plurally for other distances', () => {
        const resultTitle1 = $('.results__name').eq(0).text();
        const resultTitle2 = $('.results__name').eq(8).text();
        expect($('.distance').eq(0).text()).to.equal(`${resultTitle1} is 0.5 miles away`);
        expect($('.distance').eq(8).text()).to.equal(`${resultTitle2} is 1 mile away`);
      });

      it('should provide a link to see open pharmacies by default', () => {
        const toggle = $('.viewToggle a');
        const toggleText = $('.viewToggle');
        expect(toggleText.text()).to.equal('Showing all pharmacies. Only show pharmacies open now.');
        expect(toggle.attr('href')).to.equal(`/find-a-pharmacy/results?latitude=${searchOrigin.latitude}&location=${location}&longitude=${searchOrigin.longitude}&open=true`);
      });
    });

    it('should provide a link to see nearby only pharmacies when viewing open pharmacies', async () => {
      const location = 'Leeds';
      const searchOrigin = postcodeCoordinates.LS1;
      const body = queryBuilder(searchOrigin, { queryType: queryTypes.openNearby });
      await nockRequests.serviceSearch(body, 200, 'organisations/LS1-as.json');

      const res = await chai.request(server)
        .get(resultsRoute)
        .query({
          latitude: searchOrigin.latitude,
          location,
          longitude: searchOrigin.longitude,
          open: true,
        });
      iExpect.htmlWith200Status(res);
      const $ = cheerio.load(res.text);

      const toggle = $('.viewToggle a');
      const toggleText = $('.viewToggle');
      expect(toggleText.text()).to.equal('Only showing pharmacies open now. Show all pharmacies.');
      expect(toggle.attr('href')).to.equal(`/find-a-pharmacy/results?latitude=${searchOrigin.latitude}&location=${location}&longitude=${searchOrigin.longitude}&open=false`);
    });

    it('should handle an error from the api', async () => {
      const location = 'Leeds';
      const searchOrigin = postcodeCoordinates.LS1;
      const body = queryBuilder(searchOrigin, { queryType: queryTypes.openNearby });
      await nockRequests.serviceSearch(body, 500, 'organisations/err-as.json');

      try {
        await chai.request(server)
          .get(resultsRoute)
          .query({
            latitude: searchOrigin.latitude,
            location,
            longitude: searchOrigin.longitude,
          });
      } catch (err) {
        expect(err).to.have.status(500);
        expect(err.response).to.be.html;

        const $ = cheerio.load(err.response.text);
        expect($('.nhsuk-page-heading').text())
          .to.contain(messages.technicalProblems());
      }
    });
  });

  describe('opening times display', () => {
    const daysOfWeek = constants.daysOfWeekOrderedForUi;
    const searchOrigin = postcodeCoordinates.LS1;
    const location = 'Leeds';
    let $;

    before('run request', async () => {
      const body = queryBuilder(searchOrigin, { queryType: queryTypes.nearby });
      await nockRequests.serviceSearch(body, 200, 'organisations/LS1-openingtimes-removed-for-result-0-as.json');

      const res = await chai.request(server)
        .get(resultsRoute)
        .query({
          latitude: searchOrigin.latitude,
          location,
          longitude: searchOrigin.longitude,
        });

      iExpect.htmlWith200Status(res);
      $ = cheerio.load(res.text);
    });

    it('should remove opening times block when there are no opening times', () => {
      const resultsWithTimes = $('section:has(.openingTimes-panel)');
      const resultsWithOutTimes = $('section:not(:has(.openingTimes-panel))');

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
      const resultWithSessions = $('section:has(.openingTimes-panel)').eq(2).find('tr');
      expect(resultWithSessions.length).to.equal(8);
      expect(resultWithSessions.eq(6).find('th').text()).to.equal(daysOfWeek[5]);
      expect(resultWithSessions.eq(6).find('td').text()).to.equal('8am to 6pm');
      expect(resultWithSessions.eq(7).find('th').text()).to.equal(daysOfWeek[6]);
      expect(resultWithSessions.eq(7).find('td').text()).to.equal('Closed');
    });

    it('should have a link to the open results page when the pharmacy is closed', () => {
      const linksToOpenResultsPage = $('.openingTimes__openResults');

      expect(linksToOpenResultsPage.length).to.equal(1);
      linksToOpenResultsPage.each((index, element) => {
        expect($(element).attr('href')).to.equal(`/find-a-pharmacy/results?latitude=${searchOrigin.latitude}&location=${location}&longitude=${searchOrigin.longitude}&open=true`);
      });
    });
  });
});
