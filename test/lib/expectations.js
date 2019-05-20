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

function htmlWith200Status(res) {
  expect(res).to.have.status(200);
  expect(res).to.be.html;
}

function noResultsPageBreadcrumb($) {
  expect($('.nhsuk-breadcrumb__item').length).to.equal(4);
  expect($('.nhsuk-breadcrumb__item').last().text()).to.equal('No results');
}

function resultsPageBreadcrumb($) {
  expect($('.nhsuk-breadcrumb__item').length).to.equal(4);
  expect($('.nhsuk-breadcrumb__item').last().text()).to.equal('Results');
}

function disambiguationPageBreadcrumb($, searchTerm) {
  expect($('.nhsuk-breadcrumb__item').length).to.equal(4);
  expect($('.nhsuk-breadcrumb__item').last().text()).to.equal(`Places that match '${searchTerm}'`);
}

module.exports = {
  disambiguationPageBreadcrumb,
  findHelpPage,
  findHelpPageInvalidEntry,
  htmlWith200Status,
  noResultsPageBreadcrumb,
  resultsPageBreadcrumb,
};
