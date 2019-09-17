const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../server');
const constants = require('../../../app/lib/constants');

const expect = chai.expect;

chai.use(chaiHttp);

describe('app', () => {
  it('should include required security headers', (done) => {
    chai.request(server)
      .get(`${constants.siteRoot}`)
      .end((err, res) => {
        expect(res).to.have.header('Content-Security-Policy', 'connect-src \'self\' assets.adobedtm.com *.demdex.net *.hotjar.com:* *.hotjar.io *.omtrdc.net nhs.funnelback.co.uk; default-src \'self\'; font-src *.hotjar.com *.nhs.uk; frame-src *.demdex.net *.hotjar.com; img-src \'self\' data: *.2o7.net *.demdex.net *.everesttech.net *.hotjar.com *.omtrdc.net *.nhs.uk; script-src \'self\' \'unsafe-eval\' \'unsafe-inline\' data: assets.adobedtm.com *.demdex.net *.hotjar.com *.nhs.uk; style-src \'self\' \'unsafe-inline\' *.nhs.uk');
        expect(res).to.have.header('X-Xss-Protection', '1; mode=block');
        expect(res).to.have.header('X-Frame-Options', 'DENY');
        expect(res).to.have.header('X-Content-Type-Options', 'nosniff');
        expect(res).to.not.have.header('X-Powered-By');
        expect(res).to.have.header('X-Download-Options', 'noopen');
        expect(res).to.have.header('Strict-Transport-Security', 'max-age=15552000');
        done();
      });
  });
});
