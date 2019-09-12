const args = require("minimist")(process.argv.slice(2));
const TEST_HOST = args.testhost || "https://beta.nhs.uk/find-a-pharmacy/"
const PRODUCT = args.product
var scenarios = []
var find_a_pharmacy_scenarios = require("./find_a_pharmacy_scenarios.js")

switch(PRODUCT) {
    case "homepage":
        scenarios = [].concat(find_a_pharmacy_scenarios)
        break;
    default:
        scenarios = [].concat(find_a_pharmacy_scenarios)
}

module.exports = {
  "id": "basic_test",
  "viewports": [
    {
      "label": "laptop",
      "width": 1920,
      "height": 1080
    }
  ],
  "onBeforeScript": "puppet/onBefore.js",
  "onReadyScript": "puppet/onReady.js",
  "scenarios": scenarios,
  "paths": {
    "bitmaps_reference": "backstop_data/bitmaps_reference",
    "bitmaps_test": "backstop_data/bitmaps_test",
    "engine_scripts": "backstop_data/engine_scripts",
    "html_report": "backstop_data/html_report",
    "ci_report": "backstop_data/ci_report"
  },
  "report": ["browser"],
  "engine": "puppeteer",
  "engineOptions": {
    "args": ["--no-sandbox"]
  },
  "asyncCaptureLimit": 5,
  "asyncCompareLimit": 50,
  "debug": false,
  "debugWindow": false
}
