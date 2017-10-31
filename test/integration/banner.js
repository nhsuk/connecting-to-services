const cheerio = require('cheerio');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../server');
const constants = require('../../app/lib/constants');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Return to Choices banner', () => {
  it('should have a link back to the Choices pharmacy finder', (done) => {
    chai.request(server)
      .get(`${constants.SITE_ROOT}/finders/find-help`)
      .end((err, res) => {
        const $ = cheerio.load(res.text);

        expect($('.back-to-choices').attr('href'))
          .to.equal('https://www.nhs.uk/Service-Search/Pharmacy/LocationSearch/10?nobeta=true');
        done();
      });
  });
});
