const express = require('express');
const Postcode = require('postcode');

const app = express();

app.get('/results-open', (req, res) => {
  const location = req.query.location;

  let message = '';

  if (!location) {
    message = 'A valid postcode is required to progress';
  } else {
    const postcode = new Postcode(location);

    if (postcode.valid()) {
      message = location;
    } else {
      message = `${location} is not a valid postcode, please try again`;
    }
  }

  res.send(message);
});

module.exports = app;
