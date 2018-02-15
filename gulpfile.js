'use strict';

var gulp = require('gulp');
var klawSync = require('klaw-sync');

/**
 *  This will load all js or coffee files in the gulp directory
 *  in order to load all gulp tasks
 */
var paths = [];

// The directory that you want to explore
var directoryToExplore = "./gulp";

try {
    klawSync(directoryToExplore,{filter: function (file) {
        if((/\.(js|coffee)$/i).test(file.path)){
            paths.push(file.path);
        }
    }});
} catch (err) {
    console.error(err);
}

paths.map(function(path) {
    var pathArray = path.split('/');
    require('./gulp/' + pathArray[pathArray.length - 1]);
});


/**
 *  Default task clean temporaries directories and launch the
 *  main optimization build task
 */
gulp.task('default', ['clean'], function () {
  gulp.start('build');
  process.exit(0);
});
