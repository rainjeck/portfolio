'use strict';

module.exports = function() {
  $.gulp.task('php:copy', function() {
    return $.gulp.src('./source/php/*.php', { since: $.gulp.lastRun('php:copy') })
      .pipe($.gulp.dest($.config.root + '/assets/php'))
  })
};