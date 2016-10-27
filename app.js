const debugApp = require('./app/lib/debuggers').app;
const app = require('./server');

app.listen(app.port, () => {
  debugApp(`Express server listening on port ${app.port}`);
});
