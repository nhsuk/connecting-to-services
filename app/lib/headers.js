const key = require('../../config/config').search.apiKey;

module.exports = {
  'Content-Type': 'application/json',
  'subscription-key': key,
};
