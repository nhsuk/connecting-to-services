const fs = require('fs');
const getHeader = require('./app/lib/header/getHeader');
const buildHeaderItems = require('./app/lib/header/buildHeaderItems');
const log = require('./app/lib/logger');

const headerApiUrl = process.argv[2] || process.env.HEADER_API_URL;
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
  try {
    log.info('Building header nunjucks...');
    const response = await getHeader(headerApiUrl);
    const headerItems = buildHeaderItems(response);
    saveFile(headerItems, headerFileName);
    log.info('Build complete.');
  } catch (ex) {
    log.error(ex);
  }
}

saveHeaderItems();
