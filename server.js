const app = require('./app.js');
const config = require('./config/config');

const port = config.port;

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
