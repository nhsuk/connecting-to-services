const router = require('../../config/routes');
const httpMocks = require('node-mocks-http');
const assert = require('chai').assert;
const events = require('events');

function buildResponse() {
  return httpMocks.createResponse({ eventEmitter: events.EventEmitter });
}

describe('GP Practice router', () => {
  before('Set Syndication URL', () => {
    process.env.NHSCHOICES_SYNDICATION_URL =
      'http://v1.syndication.nhschoices.nhs.uk/organisations/gppractices/%s.json?apikey=bbccdd';
  });
  after('Unset Syndication URL', () => {
    process.env.NHSCHOICES_SYNDICATION_URL = '';
  });
  it('should get gp details', (done) => {
    const response = buildResponse();
    const request = httpMocks.createRequest({
      method: 'GET',
      url: '/gpdetails/12410',
    });

    response.on('end', () => {
      assert.equal(response.statusCode, 200);
      done();
    });

    router.handle(request, response);
  });
  it('should return 404 for unknown gp', (done) => {
    const response = buildResponse();
    const request = httpMocks.createRequest({
      method: 'GET',
      url: '/gpdetails/1',
    });

    response.on('end', () => {
      assert.equal(response.statusCode, 404);
      done();
    });

    router.handle(request, response);
  });
  it('should return 404 for unknown page', (done) => {
    const response = buildResponse();
    const request = httpMocks.createRequest({
      method: 'GET',
      url: '/gpdetails/31232',
    });

    response.on('end', () => {
      assert.equal(response.statusCode, 404);
      done();
    });

    router.handle(request, response);
  });
});
