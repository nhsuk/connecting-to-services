const chai = require('chai');
const lookup = require('../../app/lib/locate');

const expect = chai.expect;

describe('locate', () => {
  describe('byPostcode', () => {
    it('Should return lat long for valid England postcode', async () => {
      const result = await lookup.byPostcode('BD24 9PT');

      expect(result.postcode).to.equal('BD24 9PT');
      /* eslint-disable no-unused-expressions */
      expect(result.latitude).to.exist;
      expect(result.longitude).to.exist;
      /* eslint-enable no-unused-expressions */
    });
  });
  describe('byPlaces', () => {
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
  });
});
