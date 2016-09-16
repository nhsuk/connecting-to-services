const chai = require('chai');
const getAllOrgsOverviews = require('./../middleware/getDetails');
const nock = require('nock');
const getSampleResponse = require('./lib/getSampleResponse');

const expect = chai.expect;

describe('getDetails', () => {
  it('should send requests for all overviewUrls', () => {
    const url = 'http://web.site';
    const reqWithTwoOverviewUrls = { overviewUrls: [url, url] };

    const expectedAPICall =
      nock(url)
      .get('/')
      .times(2)
      .reply(200, getSampleResponse('single_pharmacy_overview'));

    getAllOrgsOverviews(reqWithTwoOverviewUrls, {}, null);
    // eslint-disable-next-line no-unused-expressions
    expect(expectedAPICall.isDone()).to.be.true;
  });
});
