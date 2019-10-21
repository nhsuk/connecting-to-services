const chai = require('chai');
const chaiHttp = require('chai-http');
const constants = require('../../app/lib/constants');
const server = require('../../server');
const { version } = require('../../package.json');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Info page', () => {
  beforeEach('set date time', () => {
    process.env.DATETIME = '2019-10-20 09:30';
  });
  afterEach('set date time', () => {
    delete process.env.DATETIME;
  });
  it('should display info', async () => {
    const res = await chai.request(server).get(`${constants.siteRoot}/info`);
    const jsonResponse = JSON.parse(res.text);
    expect(jsonResponse).to.not.be.null;
    expect(Object.keys(jsonResponse)).to.have.members(['version', 'now']);
    expect(jsonResponse.version).to.equal(version);
    expect(jsonResponse.now).to.equal('2019-10-20T09:30:00.000Z');
  });
});
