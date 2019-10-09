function getValueOrDefault(value) {
  return value || '';
}

function clean(array) {
  return array.filter(Boolean).map((i) => i.trim());
}

function getAddressLines(org) {
  const addressFields = clean([org.City, org.County, org.Postcode]);
  const addressLines = clean([org.Address1, org.Address2, org.Address3])
    .filter((l) => !addressFields.includes(l));

  return [...new Set(addressLines)];
}

function mapAddress(org) {
  return {
    city: getValueOrDefault(org.City),
    county: getValueOrDefault(org.County),
    lines: getAddressLines(org),
    postcode: getValueOrDefault(org.Postcode),
  };
}

module.exports = mapAddress;
