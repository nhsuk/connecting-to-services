const express = require('express');
const config = require('./config/config');
const app = express();
const dotenv = require('dotenv');

dotenv.config();

require('./config/express')(app, config);

app.listen(config.port, () => {
  console.log(`Express server listening on port ${config.port}`);
});
