const siteToReplace = 'http://site';
const nhsukDomain = 'https://www.nhs.uk';

function getUrl(item) {
  return item ? item.split(',')[0] : '';
}

function replaceSpaces(url) {
  // encodeURIComponent can't be used as the source URLs are already partially encoded
  return url.replace(/ /g, '%20');
}

function cleanUrl(item) {
  return replaceSpaces(getUrl(item).replace(siteToReplace, nhsukDomain));
}

module.exports = cleanUrl;
