module.exports = {
  files: {
    javascripts: {
      joinTo: {
        'js/app.js': /^app\/public\/js/,
      },
    },
    stylesheets: {
      joinTo: {
        'nhsuk.css': /app.scss/,
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
    watched: ['scss', 'app/public/js'],
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
        includePaths: ['scss'],
      },
    },
  },
};
