'use strict';

var gulp = require('gulp');

/**
 *  This will load all js or coffee files in the gulp directory
 *  in order to load all gulp tasks
 */

require('./gulp/styles');
require('./gulp/scripts');
require('./gulp/images');
require('./gulp/inject');
require('./gulp/conf');
require('./gulp/devRelease');
require('./gulp/docs');
require('./gulp/watch');
require('./gulp/build');
require('./gulp/server');
require('./gulp/marketplace');

/**
 *  Default task clean temporaries directories and launch the
 *  main optimization build task
 */
gulp.task('default',gulp.series('clean', function () {
  gulp.start('build');
  process.exit(0);
}));
