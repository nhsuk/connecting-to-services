const chai = require('chai');
const buildHeaderItems = require('../../app/lib/header/buildHeaderItems');
const headerApiResponse = require('../resources/headerApiResponse');

const expect = chai.expect;

describe('buildHeaderItems', () => {
  it('should return html for headerItems', () => {
    const output = buildHeaderItems(headerApiResponse);
    expect(output).to.exist;
  });
});
