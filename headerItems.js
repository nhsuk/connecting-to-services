const request = require('request');
const fs = require('fs');

const headerAPIURL = process.env.HEADER_API_URL;

let output = '';

request(headerAPIURL, (error, response, body) => {
  const topLevel = JSON.parse(body);
  if (!error && response.statusCode === 200) {
    for (let i = 0; i < topLevel.length; i++) {
      const item = topLevel[i];
      let itemURL = item.URL.split(',');
      itemURL = itemURL[0].replace('http://site', 'https://www.nhs.uk');
      itemURL = itemURL.replace(/ /g, '%20');
      const subItems = item.Submenus;
      output += `<li><a href="${itemURL}">${item.Title}</a>`;
      if (subItems.length !== 0) {
        output += '<ul>';
        for (let a = 0; a < subItems.length; a++) {
          const subItem = subItems[a];
          let subItemURL = subItem.URL.split(',');
          subItemURL = subItemURL[0].replace('http://site', 'https://www.nhs.uk');
          subItemURL = subItemURL.replace(/ /g, '%20');
          output += `<li><a href="${subItemURL}">${subItem.Title}</a>`;
        }
        output += '</ul>';
      }
      output += '</li>';
    }
    fs.writeFile('app/views/includes/header-items.nunjucks', output, (err) => {
      if (err) throw err;
    });
  }
});
