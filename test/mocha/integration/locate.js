const chai = require('chai');
const lookup = require('../../../app/lib/locate');

const expect = chai.expect;

describe('locate', function testWithTimeout() {
  this.timeout(15000);

  describe('byLatLon', () => {
    it('should return object with country for Scotish coordinate', async () => {
      const lat = 55;
      const lon = -4;
      const result = await lookup.byLatLon(lat, lon);

      expect(result.country).to.equal('Scotland');
      expect(result.countries).to.be.an('array');
    });

    it('should return object with country for English coordinate', async () => {
      const lat = 52.75;
      const lon = -1.25;
      const result = await lookup.byLatLon(lat, lon);

      expect(result.country).to.equal('England');
      expect(result.countries).to.be.an('array');
    });

    it('should return null for a coordinate with no known outcode', async () => {
      const lat = 1;
      const lon = 1;
      const result = await lookup.byLatLon(lat, lon);

      expect(result).to.be.null;
    });
  });

  describe('byPostcode', () => {
    it('should return lat long for valid England postcode', async () => {
      const validPostcode = 'BD24 9PT';
      const result = await lookup.byPostcode(validPostcode);

      expect(result.postcode).to.equal(validPostcode);
      expect(result.latitude).to.exist;
      expect(result.longitude).to.exist;
      expect(result.countries).to.be.an('array');
    });
  });

  describe('byOutcode', () => {
    it('should return lat long for valid England outcode', async () => {
      const validOutcode = 'BD24';
      const result = await lookup.byPostcode(validOutcode);
      expect(result.outcode).to.equal(validOutcode);
      expect(result.latitude).to.exist;
      expect(result.longitude).to.exist;
      expect(result.countries).to.be.an('array');
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
