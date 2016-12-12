const dedupe = require('../../../app/lib/dedupePharmacies');
const chai = require('chai');

const expect = chai.expect;

describe('dedupePharmacies', () => {
  describe('when the open item is one of the 4 nearby items', () => {
    it('should remove the duplicate item from the nearby items', () => {
      const duplicateId = 'AAA01';
      const services = {
        open: [{ identifier: duplicateId }],
        nearby: [
          { identifier: duplicateId },
          { identifier: 'AAA02' },
          { identifier: 'AAA03' },
          { identifier: 'AAA04' },
        ] };

      const result = dedupe(services);

      expect(result.open.length).is.equal(1);
      expect(result.nearby.length).is.equal(3);
      result.nearby.forEach((item) => {
        expect(item.identifier).to.not.equal(duplicateId);
      });
    });
  });

  describe('when the open item is not one of the 4 nearby items', () => {
    it('should remove the fourth nearby item', () => {
      const fourthId = 'AAA04';
      const services = {
        open: [],
        nearby: [
          { identifier: 'AAA01' },
          { identifier: 'AAA02' },
          { identifier: 'AAA03' },
          { identifier: fourthId },
        ] };

      const result = dedupe(services);

      expect(result.open.length).is.equal(0);
      expect(result.nearby.length).is.equal(3);
      result.nearby.forEach((item) => {
        expect(item.identifier).to.not.equal(fourthId);
      });
    });
  });

  describe('no service handling', () => {
    it('should return 2 empty arrays', () => {
      const services = {
        open: [],
        nearby: [],
      };

      const result = dedupe(services);

      expect(result.open.length).is.equal(0);
      expect(result.nearby.length).is.equal(0);
    });
  });
});
