'use strict';

module.exports = function() {
  $.gulp.task('sprite:png', function () {
	  var spriteData = $.gulp.src('./source/sprite/*.png')
	  .pipe($.gp.spritesmith({
	    algorithm: 'left-right',
	    padding: 40,
	    imgName: 'sprite.png',
	    cssName: '../tmp/spritePng.css',
	    cssFormat: 'css'
	  }));
	  return spriteData.pipe($.gulp.dest('./source/images'));
	});
};