module.exports = {
  modules: {
    autoRequire: {
      'js/app.js': ['public/js/init'],
    }
  },
  paths: {
    watched: ['scss-c2s', 'app/public/js']
  },
  conventions: {
    ignored: 'scss-c2s/c2s-ie.scss'
  },
  overrides: {
    development: {
      sourceMaps: true,
    },
    production: {
      sourceMaps: false,
      plugins: {
        afterBrunch: [
          // eslint-disable-next-line no-template-curly-in-string
          'sleep 1s && for file in public/js/*.js; do ./node_modules/uglify-es/bin/uglifyjs $file -m -c > ${file}.ugly; mv ${file}.ugly $file; done',
          'sleep 1s && yarn map-replace app/views/layout.nunjucks < assets.json && yarn map-replace app/views/includes/foot.nunjucks < assets.json'
        ]
      }
    }
  },
  files: {
    javascripts: {
      joinTo: {
        'js/app.js': /^app\/public\/js/,
      }
    },
    stylesheets: {
      joinTo: {
        'nhsuk.css': /c2s.scss/,
        'nhsukie6.css': /c2s-ie6.scss/,
        'nhsukie7.css': /c2s-ie7.scss/,
        'nhsukie8.css': /c2s-ie8.scss/,
        'print.css': /c2s-print.scss/
      },
    }
  },
  plugins: {
    sass: {
      options: {
        includePaths: ['scss-live']
      }
    },
    fingerprint: {
      srcBasePath: 'public/',
      destBasePath: 'public/',
      autoClearOldFiles: true
    }
  }
};
