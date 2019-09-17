const findAPharmacyScenarios = require('./find_a_pharmacy_scenarios');

module.exports = {
  asyncCaptureLimit: 5,
  asyncCompareLimit: 50,
  debug: false,
  debugWindow: false,
  engine: 'puppeteer',
  engineOptions: {
    args: ['--no-sandbox'],
  },
  id: 'basic_test',
  paths: {
    bitmaps_reference: 'backstop_data/bitmaps_reference',
    bitmaps_test: 'backstop_data/bitmaps_test',
  },
  report: ['browser'],
  scenarios: findAPharmacyScenarios,
  viewports: [
    {
      height: 1080,
      label: 'laptop',
      width: 1920,
    },
  ],
};
