const fs = require('fs');
const requireEnv = require('require-environment-variables');
const getHeader = require('./app/lib/header/getHeader');
const buildHeaderItems = require('./app/lib/header/buildHeaderItems');
const log = require('./app/lib/logger');

requireEnv(['HEADER_API_URL']);

const headerApiUrl = process.env.HEADER_API_URL;
const headerFileName = 'app/views/includes/header-items.nunjucks';

function saveFile(output, filename) {
  fs.writeFileSync(filename, output, (err) => {
    if (err) {
      throw err;
    }
    log.info(`${headerFileName} written.`);
  });
}

async function saveHeaderItems() {
  const response = await getHeader(headerApiUrl);
  const headerItems = buildHeaderItems(response);
  saveFile(headerItems, headerFileName);
}

saveHeaderItems();
