const sslHelper = require('../../../app/lib/sslHelper');
const chai = require('chai');

const expect = chai.expect;

describe('sslHelper', () => {
  it('create certificate should populate httpsOptions', async () => {
    await sslHelper.createCertificate();
    const httpsOptions = sslHelper.getHttpsOptions();
    /* eslint-disable no-unused-expressions */
    expect(httpsOptions.cert).to.exist;
    expect(httpsOptions.key).to.exist;
    expect(httpsOptions.passphrase).to.exist;
    /* eslint-enable no-unused-expressions */
  });
});
