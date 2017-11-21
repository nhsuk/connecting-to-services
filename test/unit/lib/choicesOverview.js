const choicesOverview = require('../../../app/lib/choicesOverview');
const chai = require('chai');

const expect = chai.expect;

describe('choicesOverview', () => {
  it('should return all items with choicesOverviewUrl', () => {
    const inputItems = [
      { identifier: 'FA008' },
      { identifier: 'XY987' },
      { identifier: 'AB123' },
    ];
    const results = choicesOverview.addUrl(inputItems);

    expect(results).to.not.be.undefined;
    expect(results).to.be.an('array');
    expect(results.length).to.be.equal(inputItems.length);
    inputItems.forEach((item, index) => {
      expect(results[index].choicesOverviewUrl)
        .to.be.equal(`https://www.nhs.uk/Services/pharmacies/Overview/DefaultView.aspx?id=${inputItems[index].identifier}`);
    });
  });
});
