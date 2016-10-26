const debug = require('debug')('finders:app');
const app = require('./server');

app.listen(app.port, () => {
  debug(`Express server listening on port ${app.port}`);
});
