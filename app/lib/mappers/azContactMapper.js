const phoneNumberParser = require('../displayUtils/phoneNumberParser');

function getContacts(asContacts) {
  const contactDetails = {};

  if (asContacts) {
    const contacts = JSON.parse(asContacts);
    contacts.forEach((c) => {
      if (c.OrganisationContactType === 'Primary') {
        const type = c.OrganisationContactMethodType;
        const lowerType = type ? type.toLowerCase() : '';
        switch (lowerType) {
          case 'fax':
          case 'telephone':
            contactDetails[lowerType] = phoneNumberParser(c.OrganisationContactValue);
            break;
          default:
            contactDetails[lowerType] = c.OrganisationContactValue;
        }
      }
    });
  }

  return contactDetails;
}

module.exports = getContacts;
