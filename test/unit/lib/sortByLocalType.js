const chai = require('chai');
const sortByLocalType = require('../../../app/lib/sortByLocalType');

const expect = chai.expect;

function createSuburb() {
  return { name_1: 'Suburb', local_type: 'Suburban Area' };
}

function createCity() {
  return { name_1: 'City', local_type: 'City' };
}

function createTown() {
  return { name_1: 'Town', local_type: 'Town' };
}

function createVillage() {
  return { name_1: 'Village', local_type: 'Village' };
}

function createHamlet() {
  return { name_1: 'Hamlet', local_type: 'Hamlet' };
}

function createOtherSettlement() {
  return { name_1: 'Other', local_type: 'Other Settlement' };
}

function createUnknown() {
  return { name_1: 'Unknown', local_type: 'Unknown' };
}

const sampleData = [
  createTown(),
  createHamlet(),
  createSuburb(),
  createOtherSettlement(),
  createUnknown(),
  createVillage(),
  createCity(),
];

describe('sortByLocalType', () => {
  it('should return City before Suburban Area', () => {
    const result = sortByLocalType(sampleData);
    expect(result[0].name_1).to.equal('City');
    expect(result[1].name_1).to.equal('Suburb');
  });
  it('should return Suburban Area before Town', () => {
    const result = sortByLocalType(sampleData);
    expect(result[1].name_1).to.equal('Suburb');
    expect(result[2].name_1).to.equal('Town');
  });
  it('should return Town before Village', () => {
    const result = sortByLocalType(sampleData);
    expect(result[2].name_1).to.equal('Town');
    expect(result[3].name_1).to.equal('Village');
  });
  it('should return Village before Hamlet', () => {
    const result = sortByLocalType(sampleData);
    expect(result[3].name_1).to.equal('Village');
    expect(result[4].name_1).to.equal('Hamlet');
  });
  it('should return Hamlet before Other', () => {
    const result = sortByLocalType(sampleData);
    expect(result[4].name_1).to.equal('Hamlet');
    expect(result[5].name_1).to.equal('Other');
  });
  it('should return Unknown last', () => {
    const result = sortByLocalType(sampleData);
    expect(result[5].name_1).to.equal('Other');
    expect(result[6].name_1).to.equal('Unknown');
  });
});
