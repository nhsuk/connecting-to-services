const nock = require('nock');
const chai = require('chai');

const expect = chai.expect;

before('global setup', () => {
  process.env.API_BASE_URL = 'https://dummy.url';
});

after('Check all nocks have been called', () => {
  try {
    console.log(nock.pendingMocks());
    expect(nock.pendingMocks().length).to.equal(0);
    expect(nock.isDone()).to.equal(true);
  } finally {
    // Ensure this runs even when the above expects fail
    nock.cleanAll();
  }
});
