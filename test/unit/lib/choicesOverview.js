const choicesOverview = require('../../../app/lib/choicesOverview');
const chai = require('chai');

const expect = chai.expect;

describe('choicesOverview', () => {
  it('should have valid ID appendend to the URL', () => {
    const validId = [{
      identifier: 'FA008'
    }];
    const fakeUrl = choicesOverview.addUrl(validId);
    expect(fakeUrl[0].choicesOverviewUrl).to.be.equal('https://www.nhs.uk/Services/pharmacies/Overview/DefaultView.aspx?id=FA008');
  });
});
