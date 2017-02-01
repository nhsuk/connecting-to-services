const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');

const input = './scss/**/*.scss';
const output = './public/css';

const sassOptions = {
  errLogToConsole: true,
  outputStyle: 'expanded',
  includePaths: ['scss']
};

gulp.task('sass', () => {
  gulp
    .src(input)
    .pipe(sourcemaps.init())
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(sourcemaps.write('./maps'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(output));
});

gulp.task('default', ['sass']);

