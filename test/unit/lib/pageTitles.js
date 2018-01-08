const chai = require('chai');
const pageTitles = require('../../../app/lib/pageTitles');

const expect = chai.expect;

describe('displayTitles', () => {
  describe('search', () => {
    it('should return \'Find a pharmacy\' when no error message', () => {
      const location = '';
      const errorMessage = undefined;
      const result = pageTitles.search(location, errorMessage);
      expect(result).to.equal('Find a pharmacy');
    });

    it('should return \'Find a pharmacy - Enter a town, city or postcode\' when error message, and no location provided', () => {
      const location = '';
      const errorMessage = 'Please enter a location';
      const result = pageTitles.search(location, errorMessage);
      expect(result).to.equal('Find a pharmacy - Enter a town, city or postcode, or use your location');
    });

    it('should return \'Find a pharmacy - We can\'t find the postcode ...\' with uppercase location when error message, and location provided', () => {
      const location = 'notapostcode';
      const errorMessage = 'Please enter a location';
      const result = pageTitles.search(location, errorMessage);
      expect(result).to.equal('Find a pharmacy - We can\'t find the postcode \'NOTAPOSTCODE\'');
    });
  });

  describe('disambiguation', () => {
    it('should return \'Find a pharmacy - We can\'t find ...\' when no places provided', () => {
      const location = 'no such place';
      const places = [];
      const result = pageTitles.disambiguation(location, places);
      expect(result).to.equal('Find a pharmacy - We can\'t find \'no such place\'');
    });

    it('should return \'Find a pharmacy - places that match ...\' when places provided', () => {
      const location = 'Leeds';
      const places = [{ name: 'Leeds1' }, { name: 'Leeds2' }];
      const result = pageTitles.disambiguation(location, places);
      expect(result).to.equal('Find a pharmacy - Places that match \'Leeds\'');
    });
  });

  describe('results', () => {
    it('should return \'Find a pharmacy - We can\'t find any pharmacies near ...\' when no open or nearby services', () => {
      const location = 'Remote location';
      const openServices = [];
      const nearbyServices = [];
      const result = pageTitles.results(location, openServices, nearbyServices);
      expect(result).to.equal('Find a pharmacy - We can\'t find any pharmacies near Remote location');
    });

    it('should return \'Find a pharmacy - Pharmacies near ...\' with friendly location when services are available', () => {
      const location = 'City, County, Postcode';
      const openServices = [{ name: 'one' }];
      const nearbyServices = [{ name: 'nearby' }];
      const result = pageTitles.results(location, openServices, nearbyServices);
      expect(result).to.equal('Pharmacies near City');
    });

    it('should return \'Find a pharmacy - Pharmacies near ...\' with friendly location when open services available, but no nearby services', () => {
      const location = 'City, County, Postcode';
      const openServices = [{ name: 'one' }];
      const nearbyServices = [];
      const result = pageTitles.results(location, openServices, nearbyServices);
      expect(result).to.equal('Pharmacies near City');
    });

    it('should return \'Find a pharmacy - Pharmacies near ...\' with friendly location when no open services, but nearby services are available', () => {
      const location = 'City, County, Postcode';
      const openServices = [];
      const nearbyServices = [{ name: 'nearby' }];
      const result = pageTitles.results(location, openServices, nearbyServices);
      expect(result).to.equal('Pharmacies near City');
    });
  });
});
