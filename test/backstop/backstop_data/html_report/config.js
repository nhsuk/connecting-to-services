report({
  "testSuite": "BackstopJS",
  "tests": [
    {
      "pair": {
        "reference": "../bitmaps_reference/basic_test_search_page_0_document_0_laptop.png",
        "test": "../bitmaps_test/20190917-211134/basic_test_search_page_0_document_0_laptop.png",
        "selector": "document",
        "fileName": "basic_test_search_page_0_document_0_laptop.png",
        "label": "search page",
        "requireSameDimensions": true,
        "misMatchThreshold": 0.1,
        "url": "https://beta.nhs.uk/find-a-pharmacy/",
        "referenceUrl": "",
        "expect": 0,
        "viewportLabel": "laptop",
        "diff": {
          "isSameDimensions": true,
          "dimensionDifference": {
            "width": 0,
            "height": 0
          },
          "misMatchPercentage": "0.00",
          "analysisTime": 62
        }
      },
      "status": "pass"
    },
    {
      "pair": {
        "reference": "../bitmaps_reference/basic_test_results_page_0_document_0_laptop.png",
        "test": "../bitmaps_test/20190917-211134/basic_test_results_page_0_document_0_laptop.png",
        "selector": "document",
        "fileName": "basic_test_results_page_0_document_0_laptop.png",
        "label": "results page",
        "requireSameDimensions": true,
        "misMatchThreshold": 0.1,
        "url": "https://beta.nhs.uk/find-a-pharmacy/results?location=Liverpool&open=false",
        "referenceUrl": "",
        "expect": 0,
        "viewportLabel": "laptop",
        "diff": {
          "isSameDimensions": true,
          "dimensionDifference": {
            "width": 0,
            "height": 0
          },
          "misMatchPercentage": "0.00"
        }
      },
      "status": "pass"
    },
    {
      "pair": {
        "reference": "../bitmaps_reference/basic_test_we_cant_find_page_0_document_0_laptop.png",
        "test": "../bitmaps_test/20190917-211134/basic_test_we_cant_find_page_0_document_0_laptop.png",
        "selector": "document",
        "fileName": "basic_test_we_cant_find_page_0_document_0_laptop.png",
        "label": "we can't find page",
        "requireSameDimensions": true,
        "misMatchThreshold": 0.1,
        "url": "https://beta.nhs.uk/find-a-pharmacy/results?location=Glasgow&open=false",
        "referenceUrl": "",
        "expect": 0,
        "viewportLabel": "laptop",
        "diff": {
          "isSameDimensions": true,
          "dimensionDifference": {
            "width": 0,
            "height": 0
          },
          "misMatchPercentage": "0.00",
          "analysisTime": 57
        }
      },
      "status": "pass"
    }
  ],
  "id": "basic_test"
});