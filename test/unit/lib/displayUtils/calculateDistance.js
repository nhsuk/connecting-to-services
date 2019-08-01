const chai = require('chai');

const calculateDistance = require('../../../../app/lib/displayUtils/calculateDistance');

const expect = chai.expect;

describe('calculateDistance', () => {
  it('should return the distance between the points', () => {
    const expectedDistance = 372.2202045151598;
    const origin = { lat: -0.118003, lon: 51.526624 };
    const destination = { lat: -3.188458, lon: 55.953487 };

    const distance = calculateDistance(origin, destination);

    expect(distance).to.equal(expectedDistance);
  });

  it('should return 0 when the points are the same', () => {
    const origin = { lat: -1.5, lon: 54 };
    const destination = { lat: -1.5, lon: 54 };

    const distance = calculateDistance(origin, destination);

    expect(distance).to.equal(0);
  });
});
