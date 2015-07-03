'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

module.exports = function (options) {

  gulp.task('tdd', function () {
    gulp.start('mocha');
    gulp.watch([options.server + '/api/**/*.js'], ['mocha']);
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
