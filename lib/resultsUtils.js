function generateRequestUrl(req) {
  const apikey = process.env.NHSCHOICES_SYNDICATION_APIKEY;
  const baseUrl = process.env.NHSCHOICES_SYNDICATION_BASEURL;

  const location = req.query.location;

  const url =
    `${baseUrl}/organisations/pharmacies/postcode/${location}.xml?apikey=${apikey}&range=100&page=`;

  return url;
}

module.exports = { generateRequestUrl };
