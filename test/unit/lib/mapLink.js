require('object.values').shim();
const mapLink = require('../../../app/lib/mapLink');
const chai = require('chai');

const expect = chai.expect;

describe('mapLink', () => {
  describe('addUrl', () => {
    const location = 'some place';

    it('should add an additional property to all items in the input list with the google maps Url',
    () => {
      const nameOne = 'place name one';
      const nameTwo = 'place name two';
      const address = {
        line1: 'line1',
        line2: 'line2',
        line3: 'line3',
        city: 'city',
        county: 'county',
        postcode: 'AB12 3CD',
      };
      const inputList = [{
        name: nameOne,
        address,
      },
        {
          name: nameTwo,
          address,
        }];
      const start = `saddr=${location}`;
      const nameAndAddressOne = `${nameOne},${Object.values(address).join()}`;
      const destinationOne = `daddr=${nameAndAddressOne}`;
      const nearOne = `near=${nameAndAddressOne}`;

      const nameAndAddressTwo = `${nameTwo},${Object.values(address).join()}`;
      const destinationTwo = `daddr=${nameAndAddressTwo}`;
      const nearTwo = `near=${nameAndAddressTwo}`;

      const expectedMapLinkOne =
        `https://maps.google.com/maps?${start}&${destinationOne}&${nearOne}`.replace(/ /g, '+');

      const expectedMapLinkTwo =
        `https://maps.google.com/maps?${start}&${destinationTwo}&${nearTwo}`.replace(/ /g, '+');

      const results = mapLink.addUrl(location, inputList);

      expect(results).to.not.be.equal(undefined);
      expect(results).to.be.an('array');
      expect(results.length).to.be.equal(2);
      expect(results[0].mapUrl).to.be.equal(expectedMapLinkOne);
      expect(results[1].mapUrl).to.be.equal(expectedMapLinkTwo);
    });
    it('should remove any empty, null or undefined address properties', () => {
      const inputList = [{
        name: 'name',
        address: {
          line1: 'line1',
          line2: '',
          line3: null,
          city: '',
          county: undefined,
          postcode: 'AB12 3CD',
        },
      }];

      const destination = 'name,line1,AB12+3CD';
      const expectedMapLinkOne =
        `https://maps.google.com/maps?saddr=${location}&daddr=${destination}&near=${destination}`
        .replace(/ /g, '+');

      const results = mapLink.addUrl(location, inputList);

      expect(results).to.not.be.equal(undefined);
      expect(results).to.be.an('array');
      expect(results.length).to.be.equal(1);
      expect(results[0].mapUrl).to.be.equal(expectedMapLinkOne);
    });
  });
});
