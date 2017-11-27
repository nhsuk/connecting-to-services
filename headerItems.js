const fs = require('fs');
const request = require('request');
const requireEnv = require('require-environment-variables');

const log = require('./app/lib/logger');

requireEnv(['HEADER_API_URL']);

const headerAPIURL = process.env.HEADER_API_URL;
const headerFileName = 'app/views/includes/header-items.nunjucks';
const siteToReplace = 'http://site';
const nhsukDomain = 'https://www.nhs.uk';

let output = '';

request(headerAPIURL, (error, response, body) => {
  const topLevel = JSON.parse(body);

  if (!error && response.statusCode === 200) {
    for (let i = 0; i < topLevel.length; i++) {
      const item = topLevel[i];
      const itemURL = item.URL.split(',')[0].replace(siteToReplace, nhsukDomain).replace(/ /g, '%20');

      output += `<li><a href="${itemURL}">${item.Title}</a>`;

      const subItems = item.Submenus;

      if (subItems.length !== 0) {
        output += '<ul>';
        for (let j = 0; j < subItems.length; j++) {
          const subItem = subItems[j];
          const subItemURL = subItem.URL.split(',')[0].replace(siteToReplace, nhsukDomain).replace(/ /g, '%20');

          output += `<li><a href="${subItemURL}">${subItem.Title}</a>`;
        }
        output += '</ul>';
      }
      output += '</li>';
    }

    fs.writeFileSync(headerFileName, output, (err) => {
      if (err) {
        throw err;
      }
      log.info(`${headerFileName} written.`);
    });
  }
});
