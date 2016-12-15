const chai = require('chai');

const expect = chai.expect;

function findHelpPageBase($) {
  expect($('.local-header--title--question').text().trim()).to.match(/^Find a pharmacy/);
  expect($('#location').is('input')).is.equal(true);
}

function findHelpPageInvalidEntry($) {
  findHelpPageBase($);
  expect($('label[for=location]').text()).to.contain('Enter a valid postcode');
}

function findHelpPage($) {
  findHelpPageBase($);
  expect($('label[for=location]').text()).to.contain('Enter a postcode');
}

function htmlWith200Status(err, res) {
  expect(err).to.equal(null);
  expect(res).to.have.status(200);
  // eslint-disable-next-line no-unused-expressions
  expect(res).to.be.html;
}

module.exports = {
  findHelpPage,
  findHelpPageInvalidEntry,
  htmlWith200Status,
};
