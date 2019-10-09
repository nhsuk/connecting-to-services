const chai = require('chai');
const { app: { title: appTitle } } = require('../../../app/lib/constants');
const pageTitles = require('../../../app/lib/pageTitles');

const { expect } = chai;

describe('displayTitles', () => {
  describe('search', () => {
    it('should return \'Find a pharmacy\' when no error message', () => {
      const location = '';
      const errorMessage = undefined;
      const result = pageTitles.search(location, errorMessage);
      expect(result).to.equal(appTitle);
    });

    it('should return \'Find a pharmacy - Enter a town, city or postcode\' when error message, and no location provided', () => {
      const location = '';
      const errorMessage = 'Please enter a location';
      const result = pageTitles.search(location, errorMessage);
      expect(result).to.equal(`${appTitle} - Enter a town, city or postcode, or use your location`);
    });

    it('should return \'Find a pharmacy - We can\'t find the postcode ...\' with uppercase location when error message, and location provided', () => {
      const location = 'notapostcode';
      const errorMessage = 'Please enter a location';
      const result = pageTitles.search(location, errorMessage);
      expect(result).to.equal(`${appTitle} - We can't find the postcode 'NOTAPOSTCODE'`);
    });
  });

  describe('disambiguation', () => {
    it('should return \'Find a pharmacy - We can\'t find ...\' when no places provided', () => {
      const location = 'no such place';
      const places = [];
      const result = pageTitles.disambiguation(location, places);
      expect(result).to.equal(`${appTitle} - We can't find 'no such place'`);
    });

    it('should return \'Find a pharmacy - places that match ...\' when places provided', () => {
      const location = 'Leeds';
      const places = [{ name: 'Leeds1' }, { name: 'Leeds2' }];
      const result = pageTitles.disambiguation(location, places);
      expect(result).to.equal(`${appTitle} - Places that match 'Leeds'`);
    });
  });

  describe('results', () => {
    it('should return \'Find a pharmacy - We can\'t find any pharmacies near ...\' when no services', () => {
      const location = 'Remote location';
      const services = [];
      const result = pageTitles.results(location, services);
      expect(result).to.equal(`${appTitle} - We can't find any pharmacies near Remote location`);
    });

    it('should return \'Find a pharmacy - Pharmacies near ...\' with friendly location when services are available', () => {
      const location = 'City, County, Postcode';
      const services = [{ name: 'one' }];
      const result = pageTitles.results(location, services);
      expect(result).to.equal('Pharmacies near City');
    });
  });
});
