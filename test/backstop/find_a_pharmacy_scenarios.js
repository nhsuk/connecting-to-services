const args = require("minimist")(process.argv.slice(2));
const TEST_HOST = args.testhost || "https://beta.nhs.uk/find-a-pharmacy/"
module.exports =
[
    {
      "label": "search page",
      "cookiePath": "backstop_data/engine_scripts/cookies.json",
      "url": `${TEST_HOST}/`,
      "referenceUrl": "",
      "readyEvent": "",
      "readySelector": "",
      "delay": 0,
      "hideSelectors": [],
      "removeSelectors": [],
      "hoverSelector": "",
      "clickSelector": "",
      "postInteractionWait": 0,
      "selectors": [],
      "selectorExpansion": true,
      "expect": 0,
      "misMatchThreshold" : 0.1,
      "requireSameDimensions": true
    },
    {
      "label": "results page",
      "cookiePath": "backstop_data/engine_scripts/cookies.json",
      "url": `${TEST_HOST}/results?location=Liverpool`,
      "referenceUrl": "",
      "readyEvent": "",
      "readySelector": "",
      "delay": 2000,
      "hideSelectors": [],
      "removeSelectors": [],
      "hoverSelector": "",
      "clickSelector": "",
      "postInteractionWait": 0,
      "selectors": [],
      "selectorExpansion": true,
      "expect": 0,
      "misMatchThreshold" : 0.1,
      "requireSameDimensions": true
    },
    {
      "label": "we can't find page",
      "cookiePath": "backstop_data/engine_scripts/cookies.json",
      "url": `${TEST_HOST}/results?location=Glasgow`,
      "referenceUrl": "",
      "readyEvent": "",
      "readySelector": "",
      "delay": 0,
      "hideSelectors": [],
      "removeSelectors": [],
      "hoverSelector": "",
      "clickSelector": "",
      "postInteractionWait": 0,
      "selectors": [],
      "selectorExpansion": true,
      "expect": 0,
      "misMatchThreshold" : 0.1,
      "requireSameDimensions": true
    }
]