const chai = require('chai');
const cleanHeaderUrl = require('../../../app/lib/header/cleanHeaderUrl');

const expect = chai.expect;

describe('cleanHeaderUrl', () => {
  it('should replace \'http://site\' with  \'https://www.nhs.uk\' and remove text after comma', () => {
    const title = 'Health A-Z';
    const partUrl = 'Conditions/Pages/hub.aspx';
    const url = `http://site/${partUrl},${title}`;
    const output = cleanHeaderUrl(url);
    expect(output).to.equal(`https://www.nhs.uk/${partUrl}`);
  });

  it('should replaces spaces with \'%20\'', () => {
    const output = cleanHeaderUrl('http://site/some url');
    expect(output).to.equal('https://www.nhs.uk/some%20url');
  });

  it('should gracefully handle empty urls', () => {
    const output = cleanHeaderUrl('');
    expect(output).to.equal('');
  });

  it('should gracefully handle undefined urls', () => {
    const output = cleanHeaderUrl(undefined);
    expect(output).to.equal('');
  });
});
