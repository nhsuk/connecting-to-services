const fs = require('fs');
const cache = require('memory-cache');
const parse = require('csv-parse/lib/sync');
const assert = require('assert');

function populateCacheSync(path) {
  const data = fs.readFileSync(path);
  assert(data.length > 0, `No data in file: '${path}'.`);

  const records = parse(data, { columns: true });
  console.log(`${records.length} records read...`);

  assert(records[0], `No records in file: '${path}'.`);
  records.forEach((item) => {
    cache.put(item.ods_code.toUpperCase(), item);
  });
}

module.exports = populateCacheSync;
