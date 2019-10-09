const chai = require('chai');

const addressMapper = require('../../../../app/lib/mappers/azAddressMapper');

const expect = chai.expect;

describe('azAddressMapper', () => {
  it('should handle typical address', () => {
    const org = {
      Address1: '166 Woodhouse Lane',
      Address2: null,
      Address3: null,
      City: 'Leeds',
      County: 'West Yorkshire',
      Postcode: 'LS2 9HB',
    };

    const address = addressMapper(org);
    expect(address.postcode).to.eql('LS2 9HB');
    expect(address.city).to.eql('Leeds');
    expect(address.county).to.eql('West Yorkshire');
    expect(address.lines).to.eql(['166 Woodhouse Lane']);
  });
  it('should handle duplicate of city in address lines', () => {
    const org = {
      Address1: '166 Woodhouse Lane',
      Address2: 'Leeds',
      Address3: null,
      City: 'Leeds',
      County: 'West Yorkshire',
      Postcode: 'LS2 9HB',
    };

    const address = addressMapper(org);
    expect(address.postcode).to.eql('LS2 9HB');
    expect(address.city).to.eql('Leeds');
    expect(address.county).to.eql('West Yorkshire');
    expect(address.lines).to.eql(['166 Woodhouse Lane']);
  });
  it('should handle duplicate of county in address lines', () => {
    const org = {
      Address1: '166 Woodhouse Lane',
      Address2: 'Leeds',
      Address3: 'West Yorkshire',
      City: 'Leeds',
      County: 'West Yorkshire',
      Postcode: 'LS2 9HB',
    };

    const address = addressMapper(org);
    expect(address.postcode).to.eql('LS2 9HB');
    expect(address.city).to.eql('Leeds');
    expect(address.county).to.eql('West Yorkshire');
    expect(address.lines).to.eql(['166 Woodhouse Lane']);
  });
  it('should handle duplicate of postcode in address lines', () => {
    const org = {
      Address1: '166 Woodhouse Lane',
      Address2: 'Leeds',
      Address3: 'LS2 9HB',
      City: 'Leeds',
      County: 'West Yorkshire',
      Postcode: 'LS2 9HB',
    };

    const address = addressMapper(org);
    expect(address.postcode).to.eql('LS2 9HB');
    expect(address.city).to.eql('Leeds');
    expect(address.county).to.eql('West Yorkshire');
    expect(address.lines).to.eql(['166 Woodhouse Lane']);
  });
  it('should handle duplicate address lines', () => {
    const org = {
      Address1: '166 Woodhouse Lane',
      Address2: 'Leeds',
      Address3: 'Leeds',
      City: null,
      County: 'West Yorkshire',
      Postcode: 'LS2 9HB',
    };

    const address = addressMapper(org);
    expect(address.postcode).to.eql('LS2 9HB');
    expect(address.city).to.equal('');
    expect(address.county).to.eql('West Yorkshire');
    expect(address.lines.length).to.equal(2);
    expect(address.lines).to.eql(['166 Woodhouse Lane', 'Leeds']);
  });
});
