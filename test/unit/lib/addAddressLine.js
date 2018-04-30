const chai = require('chai');

const addAddressLine = require('../../../app/lib/addAddressLine');

const expect = chai.expect;

function getValidServices() {
  const nameOne = 'place name one';
  const nameTwo = 'place name two';
  const address = {
    city: 'city',
    county: 'county',
    line1: 'line1',
    line2: 'line2',
    line3: 'line3',
    postcode: 'AB12 3CD',
  };
  const services = [{
    address,
    name: nameOne,
  },
  {
    address,
    name: nameTwo,
  }];

  return services;
}

describe('addAddressLine', () => {
  it('should add first non-empty address line as addressLine property', () => {
    const services = getValidServices();

    const results = addAddressLine(services);

    expect(results).to.not.be.undefined;
    expect(results).to.be.an('array');
    expect(results.length).to.be.equal(2);
    expect(results[0].addressLine).to.be.equal('line1');
    expect(results[1].addressLine).to.be.equal('line1');
  });

  it('should add second address line as addressLine property if first line empty', () => {
    const services = getValidServices();
    services.forEach((s) => {
      s.address.line1 = '';
    });

    const results = addAddressLine(services);

    expect(results).to.not.be.undefined;
    expect(results).to.be.an('array');
    expect(results.length).to.be.equal(2);
    expect(results[0].addressLine).to.be.equal('line2');
    expect(results[1].addressLine).to.be.equal('line2');
  });

  it('should add third address line as addressLine property if first two lines are empty', () => {
    const services = getValidServices();
    services.forEach((s) => {
      s.address.line1 = '';
      s.address.line2 = '';
    });

    const results = addAddressLine(services);

    expect(results).to.not.be.undefined;
    expect(results).to.be.an('array');
    expect(results.length).to.be.equal(2);
    expect(results[0].addressLine).to.be.equal('line3');
    expect(results[1].addressLine).to.be.equal('line3');
  });

  it('should handle missing address', () => {
    const services = getValidServices();
    services.forEach((s) => {
      delete s.address;
    });

    const results = addAddressLine(services);

    expect(results).to.not.be.undefined;
    expect(results).to.be.an('array');
    expect(results.length).to.be.equal(2);
    expect(results[0].address).to.be.undefined;
    expect(results[0].addressLine).to.be.undefined;
    expect(results[1].address).to.be.undefined;
    expect(results[1].addressLine).to.be.undefined;
  });

  it('should handle missing address lines', () => {
    const services = getValidServices();
    services.forEach((s) => {
      delete s.address.line1;
      delete s.address.line2;
      delete s.address.line3;
    });

    const results = addAddressLine(services);

    expect(results).to.not.be.undefined;
    expect(results).to.be.an('array');
    expect(results.length).to.be.equal(2);
    expect(results[0].addressLine).to.be.undefined;
    expect(results[1].addressLine).to.be.undefined;
  });
});
