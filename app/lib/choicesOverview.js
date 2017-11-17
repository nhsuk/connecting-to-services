function choicesOverviewUrl(inputList) {
  return inputList.map((item) => {
    const identifier = item.identifier;
    const overviewUrl = `https://www.nhs.uk/Services/pharmacies/Overview/DefaultView.aspx?id=${identifier}`;

    // eslint-disable-next-line no-param-reassign
    item.overviewUrl = overviewUrl;
    return item;
  });
}

module.exports = {
  choicesOverviewUrl,
};
