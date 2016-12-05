const chai = require('chai');
const backLinkUtils = require('../../../app/lib/backLinkUtils');

const expect = chai.expect;

const referer = 'not-real';

describe('backLinkUtils', () => {
  describe('behavior for default values', () => {
    function getNull() {
      return '';
    }

    const req = {
      get: getNull,
    };

    const res = {
      locals: {},
    };

    const response = backLinkUtils(req, res);

    it('should return the JS fallback', () => {
      const url = response.url;
      // eslint-disable-next-line no-script-url
      expect(url).to.equal('javascript:history.back();');
    });

    it('should return \'Back\' when there is no context', () => {
      const text = response.text;

      expect(text).to.equal('Back');
    });
  });

  describe('behavior for non-default values', () => {
    function getReferer() {
      return referer;
    }

    const req = {
      get: getReferer,
    };

    const res = {
      locals: {
        context: 'stomach-ache',
      },
    };

    const response = backLinkUtils(req, res);

    it('should return the referer', () => {
      const url = response.url;

      expect(url).to.equal(referer);
    });

    it('should return backLinkText based on the context', () => {
      const text = response.text;

      expect(text).to.equal('Back to information on stomach ache');
    });
  });
});
