const fs = require('fs');
const nock = require('nock');
const path = require('path');
const util = require('util');

const readFile = util.promisify(fs.readFile);

const headers = require('../../app/lib/headers');
const search = require('../../config/config').search;

const searchHost = `https://${search.host}`;

async function createNock(postPath, body, statusCode, responsePath) {
  const data = await readFile(path.join(__dirname, `../resources/${responsePath}`), 'utf8');
  return nock(searchHost, { encodedQueryParams: true, reqheaders: headers })
    .post(`/service-search${postPath}`, body)
    .query({ 'api-version': search.version })
    .reply(statusCode, data);
}

async function serviceSearch(body, statusCode, responsePath) {
  await createNock('/search', body, statusCode, responsePath);
}

function serviceSearchUnavailable(message) {
  return nock(searchHost, { encodedQueryParams: true, reqheaders: headers })
    .post('/service-search/search', {})
    .replyWithError({ message });
}

module.exports = {
  serviceSearch,
  serviceSearchUnavailable,
};
