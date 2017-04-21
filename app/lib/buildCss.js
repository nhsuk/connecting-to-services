const sass = require('node-sass');
const importOnce = require('node-sass-import-once');
const fs = require('fs');

const files = [
  { from: 'finders', to: 'nhsuk' },
  { from: 'c2s-ie6', to: 'c2s-ie6' },
  { from: 'c2s-ie7', to: 'c2s-ie7' },
  { from: 'c2s-ie8', to: 'c2s-ie8' },
  { from: 'c2s-print', to: 'c2s-print' }
];

function renderQueue() {
  const file = files.shift();
  if (!file) {
    return;
  }
  sass.render(
    {
      file: `./scss/c2s/${file.from}.scss`,
      importer: importOnce,
      importOnce: {
        index: true
      },
      includePaths: ['node_modules/nhsuk-frontend/dist/scss'],
      outputStyle: 'compressed',
    }, (error, result) => {
    if (error) {
      // eslint-disable-next-line no-console
      console.log(error.message);
    } else {
      fs.writeFileSync(`./public/assets/css/${file.to}.css`, result.css);
      // eslint-disable-next-line no-console
      console.log(`Written ${file.to}.css`);
      renderQueue();
    }
  });
}

renderQueue();
