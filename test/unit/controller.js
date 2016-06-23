const controller = require('../../app/controllers/gp-practice');
const httpMocks = require('node-mocks-http');
const assert = require('chai').assert;
const events = require('events');

function buildResponse() {
  return httpMocks.createResponse({ eventEmitter: events.EventEmitter });
}

describe('GP Practice controller', () => {
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
      params: { gpId: '12345' },
    });

    response.on('end', () => {
      assert.equal(response.statusCode, 200);
      done();
    });

    controller.index(request, response);
  });
});
