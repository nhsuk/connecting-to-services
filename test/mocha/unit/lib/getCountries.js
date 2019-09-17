const chai = require('chai');
const getCountries = require('../../../../app/lib/placeHelper').getCountries;

const expect = chai.expect;

describe('getCountries', () => {
  it('should return unique list of contries ordered alphabetically', () => {
    const name = 'Newport';
    const england = 'England';
    const scotland = 'Scotland';
    const wales = 'Wales';
    const places = [
      { country: scotland, name },
      { country: england, name },
      { country: scotland, name },
      { country: wales, name },
      { country: england, name },
      { country: wales, name },
    ];
    const result = getCountries(places);
    expect(result.length).to.equal(3);
    expect(result[0]).to.equal(england);
    expect(result[1]).to.equal(scotland);
    expect(result[2]).to.equal(wales);
  });
});
