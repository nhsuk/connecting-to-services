const chai = require('chai');
const backLinkUtils = require('../../../app/lib/backLinkUtils');
const contexts = require('../../../app/lib/contexts');

const expect = chai.expect;

const referer = 'not-real';

describe('backLinkUtils', () => {
  function noReferer() { return ''; }

  describe('text', () => {
    const reqMock = { get: noReferer };

    it('should return \'Back\' when context is not stomach ache', () => {
      const res = { locals: {} };

      const text = backLinkUtils(reqMock, res).text;

      expect(text).to.equal('Back');
    });

    it('should return back link for stomach ache when context is stomach ache', () => {
      const res = { locals: { context: contexts.stomachAche.context } };

      const text = backLinkUtils(reqMock, res).text;

      expect(text).to.equal('Back to information on stomach ache');
    });
  });

  describe('url', () => {
    function getReferer() { return referer; }

    const mockReqWithReferer = { get: getReferer };
    const mockReqWithNoReferer = { get: noReferer };

    const mockResWithContext = { locals: { context: contexts.stomachAche.context } };
    const mockResNoContext = { locals: {} };

    describe('with unknown context', () => {
      it('should return the JS fallback when there is no referer', () => {
        const url = backLinkUtils(mockReqWithNoReferer, mockResNoContext).url;

        // eslint-disable-next-line no-script-url
        expect(url).to.equal('javascript:history.back();');
      });

      it('should return the referer when there is one', () => {
        const url = backLinkUtils(mockReqWithReferer, mockResNoContext).url;

        expect(url).to.equal(referer);
      });
    });

    describe('with known context', () => {
      it('should return the link to stomach ache', () => {
        const url = backLinkUtils({}, mockResWithContext).url;

        expect(url).to.equal(contexts.stomachAche.url);
      });
    });
  });
});
