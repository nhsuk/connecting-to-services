const nock = require('nock');

const headers = require('../../app/lib/headers');
const search = require('../../config/config').search;

const searchHost = `https://${search.host}`;

function createNock(path, body, statusCode, responsePath) {
  // eslint-disable-next-line global-require, import/no-dynamic-require
  const response = require(`../resources/${responsePath}`);
  return nock(searchHost, { encodedQueryParams: true, reqheaders: headers })
    .post(`/service-search${path}`, body)
    .query({ 'api-version': search.version })
    .reply(statusCode, response);
}

function serviceSearch(body, statusCode, responsePath) {
  createNock('/search', body, statusCode, responsePath);
}

function serviceSearchUnavailable(message) {
  return nock(searchHost, { encodedQueryParams: true, reqheaders: headers })
    .post('/service-search/search', {})
    .replyWithError({ message });
}

module.exports = {
  // postcodeSearch,
  serviceSearch,
  serviceSearchUnavailable,
};
