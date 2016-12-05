const nock = require('nock');
const chai = require('chai');
const getSampleResponse = require('./resources/getSampleResponse');

const expect = chai.expect;

before('global setup', () => {
  const ls27ue = 'LS27UE';
  const ls27ueResponse = getSampleResponse('postcodesio-responses/ls27ue.json');
  const serviceApiResponse = getSampleResponse('service-api-responses/-1,54.json');
  const ls27ueResult = JSON.parse(ls27ueResponse).result;
  const latitude = ls27ueResult.latitude;
  const longitude = ls27ueResult.longitude;

  nock(process.env.API_BASE_URL)
    .get(`/nearby?latitude=${latitude}&longitude=${longitude}`)
    .times(4)
    .reply(200, serviceApiResponse);

  nock('https://api.postcodes.io')
    .get(`/postcodes/${ls27ue}`)
    .times(4)
    .reply(200, ls27ueResponse);
});

after('Check all nocks have been called', () => {
  expect(nock.pendingMocks().length).to.equal(0);
  expect(nock.isDone()).to.equal(true);
  nock.cleanAll();
});
