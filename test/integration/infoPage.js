const chai = require('chai');
const chaiHttp = require('chai-http');
const constants = require('../../app/lib/constants');
const server = require('../../server');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Info page', () => {
  it('should display info', async () => {
    const res = await chai.request(server).get(`${constants.siteRoot}/info`);
    const jsonResponse = JSON.parse(res.text);
    expect(jsonResponse).to.not.be.null;
    expect(Object.keys(jsonResponse)).to.have.members(['version', 'now']);
    expect(jsonResponse.version).to.not.be.null;
    expect(jsonResponse.now).to.not.be.null;
  });
});
