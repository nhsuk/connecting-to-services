const chai = require('chai');

const { expect } = chai;

function htmlWith200Status(res) {
  expect(res).to.have.status(200);
  expect(res).to.be.html;
}

function noResultsPageBreadcrumb($) {
  expect($('.nhsuk-c-breadcrumb__item').length).to.equal(4);
  expect($('.nhsuk-c-breadcrumb__item').last().text()).to.equal('No results');
}

function resultsPageBreadcrumb($) {
  expect($('.nhsuk-c-breadcrumb__item').length).to.equal(4);
  expect($('.nhsuk-c-breadcrumb__item').last().text()).to.equal('Results');
}

function disambiguationPageBreadcrumb($, searchTerm) {
  expect($('.nhsuk-c-breadcrumb__item').length).to.equal(4);
  expect($('.nhsuk-c-breadcrumb__item').last().text()).to.equal(`Places that match '${searchTerm}'`);
}

function call111Callout($) {
  expect($('.callout--muted p').text()).to.equal('Call 111 if you need urgent treatment and you can’t find an open pharmacy.');
}

function midsomerNortonResults($, location, numberOfResults) {
  expect($('h1').text()).to.equal('Pharmacies near Midsomer Norton');

  const results = $('.results__item');
  expect(results.length).to.equal(numberOfResults);

  const mapLinks = $('.maplink');
  expect(mapLinks.length).to.equal(10);
  mapLinks.toArray().forEach((link) => {
    expect($(link).attr('href')).to.have.string('https://maps.google.com/maps?daddr=');
    expect($(link).attr('href')).to.have.string('&saddr=');
  });

  const choicesServicesLinks = $('.serviceslink');
  expect(choicesServicesLinks.length).to.equal(10);
  choicesServicesLinks.toArray().forEach((link) => {
    expect($(link).attr('href')).to.have.string('https://www.nhs.uk/Services/pharmacies/PctServices/DefaultView.aspx');
  });
  expect(choicesServicesLinks.length).to.equal(numberOfResults);
  expect($('head title').text()).to.equal('Pharmacies near Midsomer Norton - NHS');
}

function searchAgainPage($) {
  expect($('.error-summary-heading').text())
    .to.contain('You must enter a town, city or postcode to find a pharmacy.');
  expect($('label.nhsuk-heading-m').text()).to.equal('Enter a town, city or postcode in England');
}

module.exports = {
  call111Callout,
  disambiguationPageBreadcrumb,
  htmlWith200Status,
  midsomerNortonResults,
  noResultsPageBreadcrumb,
  resultsPageBreadcrumb,
  searchAgainPage,
};
