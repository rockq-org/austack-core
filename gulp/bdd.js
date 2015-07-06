'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

module.exports = function (options) {

  gulp.task('bdd', function () {
    process.env.NODE_ENV = 'test';
    gulp.start('mocha');
    var watchList = [options.server + '/**/*.js'];
    gulp.watch(watchList, ['mocha']);
  });

  gulp.task('mocha', function () {
    return gulp.src(options.server + '/**/*.spec.js', {
        read: false
      })
      .pipe($.mocha({
        reporters: 'nyan'
      }))
      .on('error', $.util.log);
  });

};
