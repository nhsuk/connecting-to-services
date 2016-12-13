function invalidPostcodeMessage(location) {
  return `${location.toLocaleUpperCase()} is not a valid postcode, please try again`;
}

module.exports = {
  invalidPostcodeMessage,
};
