function addUrl(inputList) {
  return inputList.map((item) => {
    const identifier = item.identifier;
    const choicesServicesUrl = `https://www.nhs.uk/Services/pharmacies/PctServices/DefaultView.aspx?id=${identifier}`;

    // eslint-disable-next-line no-param-reassign
    item.choicesServicesUrl = choicesServicesUrl;
    return item;
  });
}

module.exports = {
  addUrl,
};
