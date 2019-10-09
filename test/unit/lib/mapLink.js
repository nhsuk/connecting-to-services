const qs = require('querystring');
const chai = require('chai');

const mapLink = require('../../../app/lib/mapLink');
const { placeSearch, postcodeSearch, yourLocationSearch } = require('../../../app/lib/constants');

const { expect } = chai;

describe('mapLink', () => {
  describe('addUrl', () => {
    const searchTerm = 'po5t cod3';
    const coordinates = { latitude: 52.4, longitude: -1.9 };
    const searchCriteria = { coordinates, searchTerm, searchType: postcodeSearch };

    it(
      'should add an additional property to all items in the input list with the google maps Url',
      () => {
        const nameOne = 'place name one';
        const nameTwo = 'place name two';
        const address = {
          city: 'city',
          county: 'county',
          lines: ['line1', 'line2', 'line3'],
          postcode: 'AB12 3CD',
        };
        const inputList = [{
          address,
          name: nameOne,
        },
        {
          address,
          name: nameTwo,
        }];

        const start = `saddr=${qs.escape(searchTerm)}`;

        const nameAndAddressOne = `${nameOne},${Object.values(address).join()}`;
        const nameAndAddressOneEncoded = qs.escape(nameAndAddressOne);
        const destinationOne = `daddr=${nameAndAddressOneEncoded}`;
        const nearOne = `near=${nameAndAddressOneEncoded}`;

        const nameAndAddressTwo = `${nameTwo},${Object.values(address).join()}`;
        const nameAndAddressTwoEncoded = qs.escape(nameAndAddressTwo);
        const destinationTwo = `daddr=${nameAndAddressTwoEncoded}`;
        const nearTwo = `near=${nameAndAddressTwoEncoded}`;

        const encodedQueryOne = `${destinationOne}&${nearOne}&${start}`;
        const encodedQueryTwo = `${destinationTwo}&${nearTwo}&${start}`;
        const expectedMapLinkOne = `https://maps.google.com/maps?${encodedQueryOne}`;
        const expectedMapLinkTwo = `https://maps.google.com/maps?${encodedQueryTwo}`;

        const results = mapLink.addUrl(searchCriteria, inputList);

        expect(results).to.not.be.undefined;
        expect(results).to.be.an('array');
        expect(results.length).to.be.equal(2);
        expect(results[0].mapUrl).to.be.equal(expectedMapLinkOne);
        expect(results[1].mapUrl).to.be.equal(expectedMapLinkTwo);
      }
    );

    it('should remove any empty, null or undefined address properties', () => {
      const inputList = [{
        address: {
          city: '',
          county: undefined,
          lines: ['line1', '', null],
          postcode: 'AB12 3CD',
        },
        name: 'name',
      }];

      const destination = 'name,line1,AB12 3CD';
      const encodedQuery = `daddr=${qs.escape(destination)}&near=${qs.escape(destination)}&saddr=${qs.escape(searchTerm)}`;
      const expectedMapLink = `https://maps.google.com/maps?${encodedQuery}`;

      const results = mapLink.addUrl(searchCriteria, inputList);

      expect(results).to.not.be.undefined;
      expect(results).to.not.be.equal(undefined);
      expect(results).to.be.an('array');
      expect(results.length).to.be.equal(1);
      expect(results[0].mapUrl).to.be.equal(expectedMapLink);
    });

    it('should leave start address empty for place searches', () => {
      const yourLocationSearchCriteria = {
        coordinates,
        searchTerm,
        searchType: placeSearch,
      };
      const inputList = [{
        address: {
          lines: ['line1'],
        },
        name: 'name',
      }];
      const destination = 'name,line1';
      const params = {
        daddr: destination,
        near: destination,
        saddr: '',
      };
      const expectedMapLink = `https://maps.google.com/maps?${qs.stringify(params)}`;

      const results = mapLink.addUrl(yourLocationSearchCriteria, inputList);

      expect(results.length).to.be.equal(1);
      expect(results[0].mapUrl).to.be.equal(expectedMapLink);
    });

    it('should populate start address for postcode searches', () => {
      const yourLocationSearchCriteria = {
        searchTerm,
        searchType: postcodeSearch,
      };
      const inputList = [{
        address: {
          lines: ['line1'],
        },
        name: 'name',
      }];
      const destination = 'name,line1';
      const params = {
        daddr: destination,
        near: destination,
        saddr: searchTerm,
      };
      const expectedMapLink = `https://maps.google.com/maps?${qs.stringify(params)}`;

      const results = mapLink.addUrl(yourLocationSearchCriteria, inputList);

      expect(results.length).to.be.equal(1);
      expect(results[0].mapUrl).to.be.equal(expectedMapLink);
    });

    it('should use coordinates as start address for \'your location\' searches', () => {
      const yourLocationSearchCriteria = {
        coordinates,
        searchTerm,
        searchType: yourLocationSearch,
      };
      const inputList = [{
        address: {
          lines: ['line1'],
        },
        name: 'name',
      }];
      const destination = 'name,line1';
      const params = {
        daddr: destination,
        near: destination,
        saddr: `${coordinates.latitude},${coordinates.longitude}`,
      };
      const expectedMapLink = `https://maps.google.com/maps?${qs.stringify(params)}`;

      const results = mapLink.addUrl(yourLocationSearchCriteria, inputList);

      expect(results.length).to.be.equal(1);
      expect(results[0].mapUrl).to.be.equal(expectedMapLink);
    });
  });
});
