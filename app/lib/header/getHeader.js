const request = require('request');

async function getHeaderContent(url) {
  return new Promise((resolve, reject) => {
    request(url, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        resolve(body);
      } else {
        reject(error);
      }
    });
  });
}

async function getHeader(url) {
  const body = await getHeaderContent(url);
  return JSON.parse(body);
}

module.exports = getHeader;
