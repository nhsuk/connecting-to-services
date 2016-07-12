const app = require('./server.js');
const fs = require('fs');
const cache = require('memory-cache');
const parse = require('csv-parse/lib/sync');

// TODO: move to seperate file
fs.readFile('data/gp-system-supplier.csv', (err, data) => {
  if (err) {
    console.log(`ERROR: ${err}`);
  }
  console.log('Successfully reading gp system data...');

  const records = parse(data, { columns: true });
  console.log(`${records.length} records read...`);

  records.forEach((item) => {
    cache.put(item.ods_code.toUpperCase(), item);
  });
});

app.listen(app.port, () => {
  console.log(`Express server listening on port ${app.port}`);
});
