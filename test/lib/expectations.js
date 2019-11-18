const chai = require('chai');

const expect = chai.expect;

function htmlWith200Status(res) {
  expect(res).to.have.status(200);
  expect(res).to.be.html;
}

function noResultsPageBreadcrumb($) {
  expect($('.nhsuk-breadcrumb__item').length).to.equal(3);
  expect($('.nhsuk-breadcrumb__item').last().text()).to.equal('Find a pharmacy');
}

function resultsPageBreadcrumb($) {
  expect($('.nhsuk-breadcrumb__item').length).to.equal(3);
  expect($('.nhsuk-breadcrumb__item').last().text()).to.equal('Find a pharmacy');
}

function disambiguationPageBreadcrumb($) {
  expect($('.nhsuk-breadcrumb__item').length).to.equal(3);
  expect($('.nhsuk-breadcrumb__item').last().text()).to.equal('Find a pharmacy');
}

function call111Callout($) {
  expect($('.nhsuk-care-card__heading').text()).to.contain('Call 111 if:');
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
    expect($(link).attr('href')).to.have.string('https://www.nhs.uk/Services/pharmacies/Overview/DefaultView.aspx');
  });
  expect(choicesServicesLinks.length).to.equal(numberOfResults);
  expect($('head title').text()).to.equal('Pharmacies near Midsomer Norton - NHS');
}

function searchAgainPage($) {
  expect($('.nhsuk-error-message').text())
    .to.contain('You must enter a town, city or postcode to find a pharmacy.');
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
