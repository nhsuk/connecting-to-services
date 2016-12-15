const chai = require('chai');
const setLocals = require('../../../app/middleware/setLocals');
const contexts = require('../../../app/lib/contexts');

const expect = chai.expect;

function getNull() {
  return null;
}

describe('setLocals', () => {
  describe('fromRequest', () => {
    describe('with default values', () => {
      let req;
      let res;

      before('setup the function and execute it', () => {
        req = { query: { }, get: getNull };
        res = { locals: { backLink: {} } };

        setLocals.fromRequest(req, res, () => {});
      });

      it('should set the context to \'\' when there is no context', () => {
        expect(res.locals.context).to.equal('');
      });
    });

    describe('with existing, recognised values', () => {
      let req;
      let res;

      before('setup the function and execute it', () => {
        req = {
          query: {
            location: 'location',
            context: contexts.stomachAche.context,
          },
          get: getNull,
        };
        res = { locals: { backLink: {} } };

        setLocals.fromRequest(req, res, () => {});
      });

      it('should set context based on the existing context', () => {
        expect(res.locals.context).to.equal(req.query.context);
      });
    });
  });
});
