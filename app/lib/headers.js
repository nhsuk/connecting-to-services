const { search: { apiKey: key } } = require('../../config/config');

module.exports = {
  'Content-Type': 'application/json',
  'subscription-key': key,
};
