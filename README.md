#Учебная сборка Loftschool (выпускной проект №1) 

Stack:
 - Gulp 4.0
 
Getting started:

1. clone this repo
2. cd path/to/
3. npm install gulpjs/gulp-cli -g  // Install the latest Gulp CLI tools globally
4. npm install
6. run "gulp" command to start

#Тишук Надежда

Домашнее задание первой недели

**Генерация спрайтов из графических файлов (png, gif)**

Изображения для создания спрайтов положим в `sourse/sprite`

Создаем новый таск `sprite:png` в модуле `sprite.png.js`, подключаем модуль в `tasks.js` и добавляем таск `sprite:png` в `gulpfile.js`

`sprite.png.js`:

```javascript
'use strict';

module.exports = function() {
  $.gulp.task('sprite:png', function () {
	  var spriteData = $.gulp.src('./source/sprite/*.png')
	  .pipe($.gp.spritesmith({
	    algorithm: 'left-right', // изображения справа налево
	    padding: 40, // расстояние между изображениями
	    imgName: 'sprite.png', // имя файла
	    cssName: '../style/spritePng.css', // куда кладем генерируемый css и его имя файла
	    cssFormat: 'css' // тип css
	  }));
	  return spriteData.pipe($.gulp.dest('./source/images'));
	});
};
```

**Копирование файлов из папки с исходниками в папку для продакшена (картинки, шрифты)**

Скопируем все необходимые шрифты в папку продакшена.

Необходимые для проекта шрифты положим в `sourse/fonts`

Создаем новый таск `copy:fonts` в модуле `copy.fonts.js`, подключаем модуль в `tasks.js` и добавляем таск `copy:fonts` в `gulpfile.js`

`copy.fonts.js`
```javascript
'use strict';

module.exports = function() {
  $.gulp.task('copy:fonts', function() {
    return $.gulp.src('./source/fonts/**/*.*', { since: $.gulp.lastRun('copy:fonts') })
      .pipe($.gulp.dest($.config.root + '/assets/fonts'));
  });
};
```
