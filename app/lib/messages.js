function invalidPostcodeMessage(location) {
  return `We can't find the postcode '${location}'. Check the postcode is correct and try again.`;
}

function emptyPostcodeMessage() {
  return 'You must enter a town, city or postcode to find a pharmacy.';
}

function technicalProblems() {
  return 'Sorry, we are experiencing technical problems';
}

module.exports = {
  invalidPostcodeMessage,
  emptyPostcodeMessage,
  technicalProblems,
};
