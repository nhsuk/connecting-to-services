module.exports = {
  conventions: {
    ignored: 'scss-c2s/c2s-ie.scss',
  },
  files: {
    javascripts: {
      joinTo: {
        'js/app.js': /^app\/public\/js/,
      },
    },
    stylesheets: {
      joinTo: {
        'nhsuk.css': /c2s.scss/,
        'nhsukie78.css': /c2s-ie78.scss/,
        'print.css': /c2s-print.scss/,
      },
    },
  },
  modules: {
    autoRequire: {
      'js/app.js': ['public/js/init'],
    },
  },
  overrides: {
    development: {
      sourceMaps: true,
    },
    production: {
      plugins: {
        afterBrunch: [
          // eslint-disable-next-line no-template-curly-in-string
          'sleep 1s && for file in public/js/*.js; do ./node_modules/uglify-es/bin/uglifyjs $file -m -c > ${file}.ugly; mv ${file}.ugly $file; done',
          'sleep 1s && yarn map-replace app/views/layout.nunjucks < assets.json && yarn map-replace app/views/includes/foot.nunjucks < assets.json',
        ],
      },
      sourceMaps: false,
    },
  },
  paths: {
    watched: ['scss-c2s', 'app/public/js'],
  },
  plugins: {
    babel: {
      presets: ['@babel/preset-env'],
    },
    fingerprint: {
      autoClearOldFiles: true,
      destBasePath: 'public/',
      srcBasePath: 'public/',
    },
    sass: {
      options: {
        includePaths: ['scss-live'],
      },
    },
  },
};
