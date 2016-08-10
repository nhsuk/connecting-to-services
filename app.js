const app = require('./server');

app.listen(app.port, () => {
  console.log(`Express server listening on port ${app.port}`);
});
