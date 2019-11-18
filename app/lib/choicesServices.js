function addUrl(inputList) {
  return inputList.map((item) => {
    const identifier = item.identifier;
    const choicesOverviewUrl = `https://www.nhs.uk/Services/pharmacies/Overview/DefaultView.aspx?id=${identifier}`;

    // eslint-disable-next-line no-param-reassign
    item.choicesOverviewUrl = choicesOverviewUrl;
    return item;
  });
}

module.exports = {
  addUrl,
};
