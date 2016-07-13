const app = require('./server.js');
const populateCacheSync = require('./app/lib/populateCache.js');

populateCacheSync('data/gp-system-supplier.csv');

app.listen(app.port, () => {
  console.log(`Express server listening on port ${app.port}`);
});
