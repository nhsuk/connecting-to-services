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
  expect($('label[for=location]').text()).to.contain('Enter a town, city or postcode');
}

function htmlWith200Status(err, res) {
  expect(err).to.equal(null);
  expect(res).to.have.status(200);
  expect(res).to.be.html;
}

function noResultsPageBreadcrumb($) {
  expect($('.breadcrumb li').length).to.equal(4);
  expect($('.breadcrumb__last').text()).to.equal('No results');
}

function resultsPageBreadcrumb($) {
  expect($('.breadcrumb li').length).to.equal(4);
  expect($('.breadcrumb__last').text()).to.equal('Results');
}

function disambiguationPageBreadcrumb($, searchTerm) {
  expect($('.breadcrumb li').length).to.equal(4);
  expect($('.breadcrumb__last').text()).to.equal(`Places that match '${searchTerm}'`);
}

function call111Callout($) {
  expect($('.callout--muted p').text()).to.equal('Call 111 if you need urgent treatment and you can’t find an open pharmacy.');
}

module.exports = {
  call111Callout,
  disambiguationPageBreadcrumb,
  findHelpPage,
  findHelpPageInvalidEntry,
  htmlWith200Status,
  noResultsPageBreadcrumb,
  resultsPageBreadcrumb,
};
