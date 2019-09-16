const args = require('minimist')(process.argv.slice(2));
const findAPharmacyScenarios = require('./find_a_pharmacy_scenarios');

const product = args.product;

function getScenarios() {
  let scenarios = [];
  switch (product) {
    case 'homepage':
      scenarios = [].concat(findAPharmacyScenarios);
      break;
    default:
      scenarios = [].concat(findAPharmacyScenarios);
  }
  return scenarios;
}

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
  onBeforeScript: 'puppet/onBefore.js',
  onReadyScript: 'puppet/onReady.js',
  paths: {
    bitmaps_reference: 'backstop_data/bitmaps_reference',
    bitmaps_test: 'backstop_data/bitmaps_test',
    ci_report: 'backstop_data/ci_report',
    engine_scripts: 'backstop_data/engine_scripts',
    html_report: 'backstop_data/html_report',
  },
  report: ['browser'],
  scenarios: getScenarios(),
  viewports: [
    {
      height: 1080,
      label: 'laptop',
      width: 1920,
    },
  ],
};
