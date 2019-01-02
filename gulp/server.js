'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var gulpNgConfig = require('gulp-ng-config');

var browserSync = require('browser-sync');
var browserSyncSpa = require('browser-sync-spa');

var util = require('util');

var proxyMiddleware = require('http-proxy-middleware');

function browserSyncInit(baseDir, browser) {
  browser = browser === undefined ? 'default' : browser;

  var routes = null;
  if(baseDir === conf.paths.src || (util.isArray(baseDir) && baseDir.indexOf(conf.paths.src) !== -1)) {
    routes = {
      '/bower_components': 'bower_components'
    };
  }

  var server = {
    baseDir: baseDir,
    routes: routes
  };

  /*
   * You can add a proxy to your backend by uncommenting the line below.
   * You just have to configure a context which will we redirected and the target url.
   * Example: $http.get('/users') requests will be automatically proxified.
   *
   * For more details and option, https://github.com/chimurai/http-proxy-middleware/blob/v0.9.0/README.md
   */
  // server.middleware = proxyMiddleware('/users', {target: 'http://jsonplaceholder.typicode.com', changeOrigin: true});

  browserSync.instance = browserSync.init({
    startPath: '/',
    server: server,
    browser: browser,
    ghostMode: false
  });
}

browserSync.use(browserSyncSpa({
  selector: '[ng-app]'// Only needed for angular apps
}));

gulp.task('localEnv', gulp.series(function () {
  gulp.src('./src/app/config/configFile.json')
      .pipe(gulpNgConfig('BlurAdmin.config',{environment: 'local'}))
      .pipe(gulp.dest('./src/app/config/'));
}));


gulp.task('stagingEnv',gulp.series( function () {
  gulp.src('./src/app/config/configFile.json')
      .pipe(gulpNgConfig('BlurAdmin.config',{environment: 'staging'}))
      .pipe(gulp.dest('./src/app/config/'));
}));

gulp.task('productionEnv',gulp.series( function productionEnvFunction(done) {
  gulp.src('./src/app/config/configFile.json')
      .pipe(gulpNgConfig('BlurAdmin.config',{environment: 'production'}))
      .pipe(gulp.dest('./src/app/config/'));
  done();
}));

gulp.task('serve',gulp.series('productionEnv','watch', function serveFuntion(done) {
  browserSyncInit([path.join(conf.paths.tmp, '/serve'), conf.paths.src]);
  done();
}));

gulp.task('serve:local',gulp.series('localEnv','watch', function () {
  browserSyncInit([path.join(conf.paths.tmp, '/serve'), conf.paths.src]);
}));

gulp.task('serve:staging',gulp.series('stagingEnv','watch', function () {
  browserSyncInit([path.join(conf.paths.tmp, '/serve'), conf.paths.src]);
}));

gulp.task('serve:dist', gulp.series('productionEnv','build', function () {
  browserSyncInit(conf.paths.dist);
}));

gulp.task('serve:e2e', gulp.series('inject', function () {
  browserSyncInit([conf.paths.tmp + '/serve', conf.paths.src], []);
}));

gulp.task('serve:e2e-dist',gulp.series('build', function () {
  browserSyncInit(conf.paths.dist, []);
}));
