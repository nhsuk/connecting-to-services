const chai = require('chai');

const contactMapper = require('../../../../app/lib/mappers/azContactMapper');

const expect = chai.expect;

describe('azContactMapper', () => {
  it('should handle no contacts', () => {
    const contacts = contactMapper(null);
    expect(contacts).to.eql({});
  });
  it('should get telephone number when primary contact', () => {
    const contact = {
      OrganisationContactMethodType: 'Telephone',
      OrganisationContactType: 'Primary',
      OrganisationContactValue: '01904 877554',
    };

    const contacts = contactMapper(JSON.stringify([contact]));
    expect(contacts).to.eql({ telephone: contact.OrganisationContactValue });
  });
  it('should get fax number when primary contact', () => {
    const contact = {
      OrganisationContactMethodType: 'Fax',
      OrganisationContactType: 'Primary',
      OrganisationContactValue: '01904 877554',
    };
    const contacts = contactMapper(JSON.stringify([contact]));
    expect(contacts).to.eql({ fax: contact.OrganisationContactValue });
  });
  it('should get non phone contact details when primary contact', () => {
    const contact = {
      OrganisationContactMethodType: 'email',
      OrganisationContactType: 'Primary',
      OrganisationContactValue: 'pharmacist@pharmacy.co.uk',
    };

    const contacts = contactMapper(JSON.stringify([contact]));
    expect(contacts).to.eql({ email: contact.OrganisationContactValue });
  });
  it('should get multiple primary contact details', () => {
    const contact1 = {
      OrganisationContactMethodType: 'Fax',
      OrganisationContactType: 'Primary',
      OrganisationContactValue: '01904 877555',
    };
    const contact2 = {
      OrganisationContactMethodType: 'Telephone',
      OrganisationContactType: 'Primary',
      OrganisationContactValue: '01904 877444',
    };
    const contacts = contactMapper(JSON.stringify([contact1, contact2]));
    expect(contacts).to.eql({
      fax: contact1.OrganisationContactValue,
      telephone: contact2.OrganisationContactValue,
    });
  });
  it('if multiple primary contacts of same type then last one wins', () => {
    const contact1 = {
      OrganisationContactMethodType: 'Telephone',
      OrganisationContactType: 'Primary',
      OrganisationContactValue: '01904 877555',
    };
    const contact2 = {
      OrganisationContactMethodType: 'Telephone',
      OrganisationContactType: 'Primary',
      OrganisationContactValue: '01904 877444',
    };
    const contacts = contactMapper(JSON.stringify([contact1, contact2]));
    expect(contacts).to.eql({
      telephone: contact2.OrganisationContactValue,
    });
  });
  it('should ignore non primary contact details', () => {
    const contact1 = {
      OrganisationContactMethodType: 'Fax',
      OrganisationContactType: 'Other',
      OrganisationContactValue: '01904 877555',
    };
    const contact2 = {
      OrganisationContactMethodType: 'Telephone',
      OrganisationContactType: 'Primary',
      OrganisationContactValue: '01904 877444',
    };
    const contacts = contactMapper(JSON.stringify([contact1, contact2]));
    expect(contacts).to.eql({
      telephone: contact2.OrganisationContactValue,
    });
  });
});
