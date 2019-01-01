'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')();

gulp.task('wintersmith-generate',gulp.series( $.shell.task([
  'wintersmith build'
], { cwd: 'docs' })));

gulp.task('deploy-docs',gulp.series('wintersmith-generate', function() {
  return gulp.src('./docs/build/**/*')
      .pipe($.ghPages());
}));