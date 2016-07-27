const app = require('./server.js');

app.listen(app.port, () => {
  console.log(`Express server listening on port ${app.port}`);
});
