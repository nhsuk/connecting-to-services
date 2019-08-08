const chai = require('chai');

const calculateDistance = require('../../../../app/lib/displayUtils/calculateDistance');

const expect = chai.expect;

describe('calculateDistance', () => {
  it('should return the distance between the points', () => {
    const expectedDistance = 372.2202045151598;
    const origin = { latitude: -0.118003, longitude: 51.526624 };
    const destination = { latitude: -3.188458, longitude: 55.953487 };

    const distance = calculateDistance(origin, destination);

    expect(distance).to.equal(expectedDistance);
  });

  it('should return 0 when the points are the same', () => {
    const origin = { latitude: -1.5, longitude: 54 };
    const destination = { latitude: -1.5, longitude: 54 };

    const distance = calculateDistance(origin, destination);

    expect(distance).to.equal(0);
  });
});
