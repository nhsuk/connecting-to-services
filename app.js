const express = require('express');
const Postcode = require('postcode');

const app = express();

app.get('/results-open', (req, res) => {
  const location = req.query.location;
  const postcode = new Postcode(location);

  let message = '';

  if (postcode.valid()) {
    message = location;
  } else {
    message = `${location} is not a valid postcode, please try again`;
  }

  res.send(message);
});

module.exports = app;
