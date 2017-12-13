const dedupe = require('../../../app/lib/dedupePharmacies');
const chai = require('chai');

const expect = chai.expect;

describe('dedupePharmacies', () => {
  const nearbyServices = [
    { identifier: 'AAA01' },
    { identifier: 'AAA02' },
    { identifier: 'AAA03' },
    { identifier: 'AAA04' },
    { identifier: 'AAA05' },
    { identifier: 'AAA06' },
    { identifier: 'AAA07' },
    { identifier: 'AAA08' },
    { identifier: 'AAA09' },
    { identifier: 'AAA10' },
  ];

  describe('when the open item is one of the 10 nearby items', () => {
    it('should remove the duplicate item from the nearby items', () => {
      const duplicateItem = nearbyServices[0];
      const services = {
        open: [duplicateItem],
        nearby: nearbyServices,
      };

      const result = dedupe(services);

      expect(result.open.length).is.equal(1);
      expect(result.nearby.length).is.equal(9);
      expect(result.nearby).to.deep.not.include.members([duplicateItem]);
    });
  });

  describe('when there is no open item and there are 10 nearby items', () => {
    it('should remove the tenth nearby item', () => {
      const tenthItem = nearbyServices[9];
      const services = {
        open: [],
        nearby: nearbyServices,
      };

      const result = dedupe(services);

      expect(result.open.length).is.equal(0);
      expect(result.nearby.length).is.equal(9);
      expect(result.nearby).to.deep.not.include.members([tenthItem]);
    });
  });

  describe('when the open item is not one of the 10 nearby items', () => {
    it('should remove the fourth nearby item', () => {
      const tenthItem = nearbyServices[9];
      const services = {
        open: [{ identifier: 'AAA11' }],
        nearby: nearbyServices,
      };

      const result = dedupe(services);

      expect(result.open.length).is.equal(1);
      expect(result.nearby.length).is.equal(9);
      expect(result.nearby).to.deep.not.include.members([tenthItem]);
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
