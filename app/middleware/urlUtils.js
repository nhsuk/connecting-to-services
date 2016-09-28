function urlForPharmacyPostcodeSearch(req, res, next) {
  const location = res.locals.location;
  const syndicationApiKey = process.env.NHSCHOICES_SYNDICATION_APIKEY;
  const baseUrl = process.env.NHSCHOICES_SYNDICATION_BASEURL;
  const requestUrl =
    `${baseUrl}/organisations/pharmacies/postcode/` +
    `${location}.xml?range=50&apikey=${syndicationApiKey}`;

  // eslint-disable-next-line no-param-reassign
  req.urlForPharmacy = requestUrl;
  next();
}

module.exports = {
  urlForPharmacyPostcodeSearch,
};
