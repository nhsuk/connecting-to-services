const chai = require('chai');

const expect = chai.expect;

function findHelpPage($) {
  expect($('.local-header--title--question').text().trim())
    .to.match(/^Find a pharmacy/);
  expect($('label[for=location]').text()).to.contain('Enter a postcode');
  expect($('#location').is('input')).is.equal(true);
}

function htmlWith200Status(err, res) {
  expect(err).to.equal(null);
  expect(res).to.have.status(200);
  // eslint-disable-next-line no-unused-expressions
  expect(res).to.be.html;
}

module.exports = {
  findHelpPage,
  htmlWith200Status,
};
