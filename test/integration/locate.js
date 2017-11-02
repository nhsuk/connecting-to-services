const chai = require('chai');
const lookup = require('../../app/lib/locate');

const expect = chai.expect;

describe('locate', () => {
  describe('byPostcode', () => {
    it('Should return lat long for valid England postcode', async () => {
      const validPostcode = 'BD24 9PT';
      const result = await lookup.byPostcode(validPostcode);

      expect(result.postcode).to.equal(validPostcode);
      /* eslint-disable no-unused-expressions */
      expect(result.latitude).to.exist;
      expect(result.longitude).to.exist;
      /* eslint-enable no-unused-expressions */
    });
  });
  describe('byPlace', () => {
    it('Should return list of places', async () => {
      const results = await lookup.byPlace('Leeds');

      expect(results).to.be.an('array');
      expect(results.length).to.equal(3);
      // note: the results are a set and not a list so order in not guaranteed
      /* eslint-disable no-unused-expressions */
      expect(results[0].name_1).to.exist;
      expect(results[0].local_type).to.exist;
      expect(results[0].outcode).to.exist;
      expect(results[0].region).to.exist;
      /* eslint-enable no-unused-expressions */
    });

    it('Should ignore multiple spaces between words', async () => {
      const results = await lookup.byPlace('stoke  newington');

      expect(results).to.be.an('array');
      expect(results.length).to.equal(1);
    });

    it('Should ignore non-alphanumeric character', async () => {
      const results = await lookup.byPlace('stoke . newington');

      expect(results).to.be.an('array');
      expect(results.length).to.equal(1);
    });

    it('Should return no results for unknown place', async () => {
      const results = await lookup.byPlace('fgfgfgfgfgfg');

      expect(results).to.be.an('array');
      expect(results.length).to.equal(0);
    });

    it('Should limit results', async () => {
      const results = await lookup.byPlace('le', 5);

      expect(results).to.be.an('array');
      expect(results.length).to.equal(5);
    });
  });
});
