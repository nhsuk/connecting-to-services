const sass = require('node-sass');
const importOnce = require('node-sass-import-once');
const fs = require('fs');

sass.render({
  file: './scss/c2s/finders.scss',
  importer: importOnce,
  importOnce: {
    index: true
  },
  includePaths: ['node_modules/'],
  outputStyle: 'compressed',
  outFile: './public/css/nhsuk.css'
}, (error, result) => {
  if (error) {
    console.log(error.message);
  } else {
    fs.writeFileSync('./public/assets/css/nhsuk.css', result.css);
  }
});
