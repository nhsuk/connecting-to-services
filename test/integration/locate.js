const chai = require('chai');
const lookup = require('../../app/lib/locate');

const expect = chai.expect;

describe('locate', function testWithTimeout() {
  this.timeout(15000);
  describe('byPostcode', () => {
    it('should return lat long for valid England postcode', async () => {
      const validPostcode = 'BD24 9PT';
      const result = await lookup.byPostcode(validPostcode);

      expect(result.postcode).to.equal(validPostcode);
      expect(result.latitude).to.exist;
      expect(result.longitude).to.exist;
    });
  });
  describe('byPlace', () => {
    it('should return list of places', async () => {
      const results = await lookup.byPlace('Leeds');

      expect(results).to.be.an('array');
      expect(results.length).to.equal(3);
      // note: the results are a set and not a list so order in not guaranteed
      expect(results[0].name_1).to.exist;
      expect(results[0].local_type).to.exist;
      expect(results[0].outcode).to.exist;
      expect(results[0].region).to.exist;
    });

    it('should return no results for unknown place', async () => {
      const results = await lookup.byPlace('fgfgfgfgfgfg');

      expect(results).to.be.an('array');
      expect(results.length).to.equal(0);
    });

    it('should limit results', async () => {
      const results = await lookup.byPlace('le', 5);

      expect(results).to.be.an('array');
      expect(results.length).to.equal(5);
    });
  });
});
