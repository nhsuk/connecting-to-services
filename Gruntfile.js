const request = require('request');
const timeGrunt = require('time-grunt');
const gruntTasks = require('load-grunt-tasks');

module.exports = (grunt) => {
  const reloadPort = 35729;
  let files;

  // show elapsed time at the end
  timeGrunt(grunt);
  // load all grunt tasks
  gruntTasks(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    develop: {
      server: {
        file: 'app.js',
      },
    },
    watch: {
      options: {
        nospawn: true,
        livereload: reloadPort,
      },
      js: {
        files: [
          'app.js',
          'app/**/*.js',
          'config/*.js',
        ],
        tasks: ['develop', 'delayed-livereload'],
      },
      css: {
        files: [
          'public/css/*.css',
        ],
        options: {
          livereload: reloadPort,
        },
      },
      views: {
        files: [
          'app/views/*.nunjucks',
          'app/views/**/*.nunjucks',
        ],
        options: { livereload: reloadPort },
      },
    },
  });

  grunt.config.requires('watch.js.files');
  files = grunt.config('watch.js.files');
  files = grunt.file.expand(files);

  grunt.registerTask(
    'delayed-livereload',
    'Live reload after the node server has restarted.',
    () => {
      const done = this.async();
      setTimeout(() => {
        request.get(`http://localhost:${reloadPort}/changed?files=${files.join(',')}`, (err, res) => {
          const reloaded = !err && res.statusCode === 200;
          if (reloaded) {
            grunt.log.ok('Delayed live reload successful.');
          } else {
            grunt.log.error('Unable to make a delayed live reload.');
          }
          done(reloaded);
        });
      }, 500);
    });

  grunt.registerTask('default', [
    'develop',
    'watch',
  ]);
};
