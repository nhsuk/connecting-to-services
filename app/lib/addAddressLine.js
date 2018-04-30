function getFirstNonEmptyLine(address) {
  return address && (address.line1 || address.line2 || address.line3);
}

function addAddressLine(service) {
  // eslint-disable-next-line no-param-reassign
  service.addressLine = getFirstNonEmptyLine(service.address);
  return service;
}

function addAddressLines(services) {
  return services.map(addAddressLine);
}

module.exports = addAddressLines;
