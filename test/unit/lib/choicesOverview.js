const choicesOverview = require('../../../app/lib/choicesOverview');
const chai = require('chai');

const expect = chai.expect;

describe('choicesOverview', () => {
  it('should have valid ID appendend to the URL', () => {
    const validId = [{
      identifier: 'FA008'
    }];
    const results = choicesOverview.addUrl(validId);

    expect(results).to.not.be.equal(undefined);
    expect(results).to.be.an('array');
    expect(results.length).to.be.equal(1);
    expect(results[0].choicesOverviewUrl).to.be.equal('https://www.nhs.uk/Services/pharmacies/Overview/DefaultView.aspx?id=FA008');
  });
});
