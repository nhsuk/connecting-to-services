// xml2js processors

function stripPrefix(name) {
  const prefixMatch = new RegExp(/(?!xmlns)^.*:/);
  return name.replace(prefixMatch, '');
}

module.exports = {
  stripPrefix,
};
