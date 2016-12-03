'use strict';

module.exports = function() {
  $.gulp.task('js:copy', function() {
    return $.gulp.src('./source/js/common/*.js', { since: $.gulp.lastRun('js:copy') })
      // .pipe($.gp.sourcemaps.init())
      // .pipe($.gp.concat('common.js'))
      // .pipe($.gp.sourcemaps.write())
      .pipe($.gulp.dest($.config.root + '/assets/js'))
  })
};
