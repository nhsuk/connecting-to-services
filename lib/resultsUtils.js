function generateRequestUrl(req) {
  const apikey = process.env.NHSCHOICES_SYNDICATION_APIKEY;
  const baseUrl = process.env.NHSCHOICES_SYNDICATION_BASEURL;

  const location = req.query.location;

  const url =
    `${baseUrl}/organisations/pharmacies/postcode/${location}.xml?apikey=${apikey}&range=100&page=`;

  return url;
}

function generateOverviewRequestUrls(results) {
  const flattenedArray = results.reduce((a, b) => a.concat(b), []);

  const apikey = process.env.NHSCHOICES_SYNDICATION_APIKEY;
  const overviewUrls = flattenedArray.map(result =>
    `${result.id}/overview.xml?apikey=${apikey}`
 );

  return overviewUrls;
}

module.exports = {
  generateRequestUrl,
  generateOverviewRequestUrls,
};
