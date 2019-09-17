const chai = require('chai');
const sortPlace = require('../../../../app/lib/placeHelper').sortPlace;

const expect = chai.expect;
function createSuburb(name) {
  return { local_type: 'Suburban Area', name_1: name };
}

function createCity(name, region, outcode) {
  return {
    local_type: 'City', name_1: name, outcode, region,
  };
}

function createTown(name) {
  return { local_type: 'Town', name_1: name };
}

function createVillage(name) {
  return { local_type: 'Village', name_1: name };
}

function createHamlet(name) {
  return { local_type: 'Hamlet', name_1: name };
}

function createOtherSettlement(name) {
  return { local_type: 'Other Settlement', name_1: name };
}

function createUnknown(name) {
  return { local_type: 'Unknown', name_1: name };
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

  describe('sort by type then address', () => {
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

    it('should return type in ascending alphabetical order for address', () => {
      const sampleData = [
        createCity('City', 'B Region', 'B1'),
        createCity('City', 'C Region', 'C1'),
        createCity('City', 'A Region', 'B1'),
      ];
      const result = sortPlace(sampleData);
      expect(result[0].region).to.equal('A Region');
      expect(result[1].region).to.equal('B Region');
      expect(result[2].region).to.equal('C Region');
    });
  });
});
