'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var browserSync = require('browser-sync');

function isOnlyChange(event) {
  return event.type === 'changed';
}

gulp.task('watch', gulp.series('inject', function watchFunction(done) {

  gulp.watch([path.join(conf.paths.src, '/*.html'), 'bower.json'], gulp.series('inject-reload'));

  gulp.watch([
    path.join(conf.paths.src, '/sass/**/*.css'),
    path.join(conf.paths.src, '/sass/**/*.scss')
  ], gulp.series(function(event) {
    if(isOnlyChange(event)) {
      gulp.start('styles-reload');
    } else {
      gulp.start('inject-reload');
    }
  }));

  gulp.watch(path.join(conf.paths.src, '/app/**/*.js'), gulp.series(function(event) {
    if(isOnlyChange(event)) {
      gulp.start('scripts-reload');
    } else {
      gulp.start('inject-reload');
    }
  }));

  gulp.watch(path.join(conf.paths.src, '/app/**/*.html'), gulp.series(function(event) {
    browserSync.reload(event.path);
  }));

  done();
}));
