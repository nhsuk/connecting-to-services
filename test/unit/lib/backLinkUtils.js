const chai = require('chai');
const backLinkUtils = require('../../../app/lib/backLinkUtils');

const expect = chai.expect;

const referer = 'not-real';

describe('backLinkUtils', () => {
  function noReferer() { return ''; }

  describe('text', () => {
    const reqMock = { get: noReferer };

    it('should return \'Back\'', () => {
      const res = { locals: {} };

      const text = backLinkUtils(reqMock, res).text;

      expect(text).to.equal('Back');
    });
  });

  describe('url', () => {
    function getReferer() { return referer; }

    const mockReqWithReferer = { get: getReferer };
    const mockReqWithNoReferer = { get: noReferer };

    const mockRes = { locals: {} };

    it('should return the JS fallback when there is no referer', () => {
      const url = backLinkUtils(mockReqWithNoReferer, mockRes).url;

      // eslint-disable-next-line no-script-url
      expect(url).to.equal('javascript:history.back();');
    });

    it('should return the referer when there is one', () => {
      const url = backLinkUtils(mockReqWithReferer, mockRes).url;

      expect(url).to.equal(referer);
    });
  });
});
