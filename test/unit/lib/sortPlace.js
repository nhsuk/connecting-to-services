const chai = require('chai');
const sortPlace = require('../../../app/lib/sortPlace');

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

function createUnknown(name) {
  return { name_1: name, local_type: 'Unknown' };
}

describe('sortPlace', () => {
  describe('sort by local type', () => {
    const sampleData = [
      createTown('Town'),
      createHamlet('Hamlet'),
      createSuburb('Suburb'),
      createOtherSettlement('Other'),
      createUnknown('Unknown'),
      createVillage('Village'),
      createCity('City'),
    ];

    it('should return City before Suburban Area', () => {
      const result = sortPlace(sampleData);
      expect(result[0].name_1).to.equal('City');
      expect(result[1].name_1).to.equal('Town');
    });

    it('should return Town before Village', () => {
      const result = sortPlace(sampleData);
      expect(result[1].name_1).to.equal('Town');
      expect(result[2].name_1).to.equal('Village');
    });

    it('should return Village before Hamlet', () => {
      const result = sortPlace(sampleData);
      expect(result[2].name_1).to.equal('Village');
      expect(result[3].name_1).to.equal('Hamlet');
    });

    it('should return Hamlet before Other', () => {
      const result = sortPlace(sampleData);
      expect(result[3].name_1).to.equal('Hamlet');
      expect(result[4].name_1).to.equal('Other');
    });

    it('should return Suburban Area before Town', () => {
      const result = sortPlace(sampleData);
      expect(result[4].name_1).to.equal('Other');
      expect(result[5].name_1).to.equal('Suburb');
    });

    it('should return Unknown last', () => {
      const result = sortPlace(sampleData);
      expect(result[5].name_1).to.equal('Suburb');
      expect(result[6].name_1).to.equal('Unknown');
    });
  });

  describe('sort by type then name', () => {
    it('should return types in ascending alphabetical order', () => {
      const sampleData = [
        createTown('B Town'),
        createTown('C Town'),
        createTown('A Town'),
        createCity('C City'),
        createCity('A City'),
        createCity('B City'),
      ];
      const result = sortPlace(sampleData);
      expect(result[0].name_1).to.equal('A City');
      expect(result[1].name_1).to.equal('B City');
      expect(result[2].name_1).to.equal('C City');
      expect(result[3].name_1).to.equal('A Town');
      expect(result[4].name_1).to.equal('B Town');
      expect(result[5].name_1).to.equal('C Town');
    });
  });
});
