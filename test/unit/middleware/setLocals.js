const chai = require('chai');
const setLocals = require('../../../app/middleware/setLocals');

const expect = chai.expect;

const referer = 'dummy-referer';

function getReferer() {
  return referer;
}

function getNull() {
  return null;
}

describe('setLocals', () => {
  describe('fromRequest', () => {
    describe('with default values', () => {
      let req;
      let res;

      before('setup the function and execute it', () => {
        req = {
          query: {
            location: 'location',
          },
          get: getNull,
        };
        res = {
          locals: {},
        };

        setLocals.fromRequest(req, res, () => {});
      });

      it('should set location based on the query location', () => {
        expect(res.locals.location).to.equal(req.query.location);
      });

      it('should set the context to \'\' when there is no context', () => {
        expect(res.locals.context).to.equal('');
      });

      it('should set the backLink to the JS fallback', () => {
        // eslint-disable-next-line no-script-url
        expect(res.locals.backLink).to.equal('javascript:history.back();');
      });

      it('should set the backLinkText to \'Back\' when there is no context', () => {
        expect(res.locals.backLinkText).to.equal('Back');
      });
    });

    describe('with existing, recognised values', () => {
      let req;
      let res;

      before('setup the function and execute it', () => {
        req = {
          query: {
            location: 'location',
            context: 'stomach-ache',
          },
          get: getReferer,
        };
        res = {
          locals: {},
        };

        setLocals.fromRequest(req, res, () => {});
      });

      it('should set location based on the query location', () => {
        expect(res.locals.location).to.equal(req.query.location);
      });

      it('should set context based on the existing context', () => {
        expect(res.locals.context).to.equal(req.query.context);
      });

      it('should set backLink to the referer', () => {
        expect(res.locals.backLink).to.equal(referer);
      });

      it('should set backLinkText based on the context', () => {
        expect(res.locals.backLinkText).to.equal('Back to information on stomach ache');
      });
    });
  });
});

