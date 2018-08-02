const chai = require('chai');

const choicesServices = require('../../../app/lib/choicesServices');

const expect = chai.expect;

describe('choicesServices', () => {
  it('should return all items with choicesServicesUrl', () => {
    const inputItems = [
      { identifier: 'FA008' },
      { identifier: 'XY987' },
      { identifier: 'AB123' },
    ];
    const results = choicesServices.addUrl(inputItems);

    expect(results).to.not.be.undefined;
    expect(results).to.be.an('array');
    expect(results.length).to.be.equal(inputItems.length);
    inputItems.forEach((item, index) => {
      expect(results[index].choicesServicesUrl)
        .to.be.equal(`https://www.nhs.uk/Services/pharmacies/PctServices/DefaultView.aspx?id=${inputItems[index].identifier}`);
    });
  });
});
