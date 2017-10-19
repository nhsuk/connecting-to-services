const fs = require('fs');
const { promisify } = require('util');
const signCertificate = promisify(require('ssl-self-signed-certificate'));

const passphrase = 'nhsuk';
const config = {
  keyFile: './certificates/key.pem',
  certificateFile: './certificates/cert.pem',
  passphraseFile: './certificates/passphrase'
};

function getHttpsOptions() {
  return {
    key: fs.readFileSync(config.keyFile),
    cert: fs.readFileSync(config.certificateFile),
    passphrase
  };
}

function createCertificate() {
  return signCertificate(passphrase, config);
}

module.exports = {
  createCertificate,
  getHttpsOptions
};
