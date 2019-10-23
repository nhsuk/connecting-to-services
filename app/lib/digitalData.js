const { analytics: { baseDataLayer } } = require('./constants');

function getPageName(categories) {
  return `${baseDataLayer}:${categories.join(':')}`;
}

function getCategories(path) {
  return path.split('/').filter(Boolean);
}

function digitalData(req) {
  const path = req.path;
  const categories = getCategories(path);

  return {
    page: {
      category: {
        primaryCategory: categories[0],
        subCategory1: categories[1],
        subCategory2: categories[2],
        subCategory3: categories[3],
      },
      pageInfo: {
        pageName: getPageName(categories),
      },
    },
  };
}

module.exports = digitalData;
