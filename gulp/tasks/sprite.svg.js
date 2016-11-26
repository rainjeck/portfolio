'use strict';

module.exports = function() {
	$.gulp.task('sprite:svg', function() {
		return $.gulp.src('./source/sprite/*.svg')
			.pipe($.gp.svgmin({
				js2svg: {
					pretty: true
				}
			}))
			.pipe($.gp.cheerio({
				run: function ($) {
					$('[fill]').removeAttr('fill');
					$('[stroke]').removeAttr('stroke');
					$('[style]').removeAttr('style');
				},
				parserOptions: { xmlMode: true }
			}))
			.pipe($.gp.replace('&gt;', '>'))
			.pipe($.gp.svgSprite({
				// shape : {
				// 	spacing : {
				// 		padding : 40 // задаем расстояние между картинками в спрайте
				// 	}
				// },
				mode : {
					symbol: {
						sprite: 'sprite.svg', // имя файла
						bust: false, // отключаем хэш в имени файла
						dest: '', // отключаем файловую струтуру по умолчанию, создаем в папке gulp.dest
						example: {
							dest: '../tmp/spriteSvgDemo.html'
						},
						render: {
							scss: {
								dest: '../tmp/spriteSvg' // куда кладем файл стилей и имя файла
							}
						}
					}
				}
				// mode: {
				//   symbol: {
				//     sprite: "../sprite.svg"
				//   }
				// }
			}))
			//.pipe($.gulp.dest($.config.root + '/assets/img'))
			.pipe($.gulp.dest('./source/images/'))
	})
};
