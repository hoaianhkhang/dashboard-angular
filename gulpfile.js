'use strict';

var gulp = require('gulp');
var klawSync = require('klaw-sync');

/**
 *  This will load all js or coffee files in the gulp directory
 *  in order to load all gulp tasks
 */
// klawSync.readdirSyncRecursive('./gulp').filter(function(file) {
//   return (/\.(js|coffee)$/i).test(file);
// }).map(function(file) {
//   console.log(file)
//   require('./gulp/' + file);
// });


var paths;
try {
    paths = klawSync('./gulp', {filter: function(file) {
        return (/\.(js|coffee)$/i).test(file.path);
    }});
} catch (er) {
    console.error(er);
}

paths.map(function(file) {
  var filePathArray = file.path.split('/');
  var fileName = filePathArray[filePathArray.length - 1];
    // require('./gulp/' + fileName);
});




/**
 *  Default task clean temporaries directories and launch the
 *  main optimization build task
 */
gulp.task('default',gulp.series('clean', function () {
  gulp.start('build');
  process.exit(0);
}));
