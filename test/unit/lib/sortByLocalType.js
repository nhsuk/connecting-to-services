const chai = require('chai');
const sortByLocalType = require('../../../app/lib/sortByLocalType');

const expect = chai.expect;

function createSuburb(name) {
  return { name_1: name, local_type: 'Suburban Area' };
}

function createCity(name) {
  return { name_1: name, local_type: 'City' };
}

function createTown(name) {
  return { name_1: name, local_type: 'Town' };
}

function createVillage(name) {
  return { name_1: name, local_type: 'Village' };
}

function createHamlet(name) {
  return { name_1: name, local_type: 'Hamlet' };
}

function createOtherSettlement(name) {
  return { name_1: name, local_type: 'Other Settlement' };
}

const sampleData = [
  createTown('Town1'),
  createHamlet('Hamlet1'),
  createSuburb('Suburb1'),
  createOtherSettlement('Other'),
  createVillage('Village1'),
  createCity('City1'),
];

describe('sortByLocalType', () => {
  it('should return City before Suburban Area', () => {
    const result = sortByLocalType(sampleData);
    // eslint-disable-next-line no-unused-expressions
    expect(result[0].name_1).to.equal('City1');
    expect(result[1].name_1).to.equal('Suburb1');
  });
  it('should return Suburban Area before Town', () => {
    const result = sortByLocalType(sampleData);
    // eslint-disable-next-line no-unused-expressions
    expect(result[1].name_1).to.equal('Suburb1');
    expect(result[2].name_1).to.equal('Town1');
  });
  it('should return Town before Village', () => {
    const result = sortByLocalType(sampleData);
    // eslint-disable-next-line no-unused-expressions
    expect(result[2].name_1).to.equal('Town1');
    expect(result[3].name_1).to.equal('Village1');
  });
  it('should return Village before Hamlet', () => {
    const result = sortByLocalType(sampleData);
    // eslint-disable-next-line no-unused-expressions
    expect(result[3].name_1).to.equal('Village1');
    expect(result[4].name_1).to.equal('Hamlet1');
  });
  it('should return Hamlet before Other', () => {
    const result = sortByLocalType(sampleData);
    // eslint-disable-next-line no-unused-expressions
    expect(result[4].name_1).to.equal('Hamlet1');
    expect(result[5].name_1).to.equal('Other');
  });
});
