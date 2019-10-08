function getValueOrDefault(value) {
  return value || '';
}

function getAddressLines(org) {
  const addressLines = [org.Address1, org.Address2, org.Address3]
    .filter((l) => l) // empty entries
    .filter((l) => l !== org.City); // duplicates of city

  // remove duplicate address lines
  return Array.from(new Set(addressLines));
}

function mapAddress(org) {
  return {
    city: getValueOrDefault(org.City),
    county: getValueOrDefault(org.County),
    line1: getValueOrDefault(org.Address1),
    line2: getValueOrDefault(org.Address2),
    line3: getValueOrDefault(org.Address3),
    lines: getAddressLines(org),
    postcode: getValueOrDefault(org.Postcode),
  };
}

module.exports = mapAddress;
