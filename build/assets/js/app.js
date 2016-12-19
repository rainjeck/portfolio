'use strict';

var doc = document,
	jDoc = $(document);

var svg4everybody = (function(){
	svg4everybody();
}());
// навигация в блоге

var checkSection = (function (){
	// private
	var followBlogLink = function(){
		$('.blog__post').each(function(i, el){
				var $this = $(this),
				topEdge = $this.offset().top - 70,
				bottomEdge = topEdge + $this.height(),
				wScroll = $(window).scrollTop();

				if (topEdge < wScroll && bottomEdge > wScroll) {
					var currentId = $this.data('section'),
						reqLink = $('.blog__nav__link').filter('[href = "#' + currentId + '"]');

					reqLink.closest('.blog__nav__item').addClass('active')
						.siblings().removeClass('active');
				}
			});
	};

	// public
	return {
		init: function() {
			followBlogLink();
		}
	}
}());

$(window).scroll(function(){
	checkSection.init();
});
var blur = function () {
	var wrapper = doc.querySelector('.blur__wrapper'),
		form = doc.querySelector('.blur__form');

	return function() {
			if (wrapper, form) {
				var imgWidth = doc.querySelector('.blur__background').offsetWidth,
					posLeft = -wrapper.offsetLeft,
					posTop = -wrapper.offsetTop,
					blurCSS = form.style;

				blurCSS.backgroundSize = imgWidth + 'px ' + 'auto';
				blurCSS.backgroundPosition = posLeft + 'px ' + posTop + 'px';
			}
		}
};

var makeBlur = blur();

makeBlur();

window.onresize = function () {
	makeBlur();
};
var fixedBlogMenu = (function () {
	// private
	var moveMenu = function () {
		var wWidth = $(window).width();

		if ( wWidth > 768 ) {
			console.log(wWidth);
			var menuWidth = $('.blog__nav__items').width(),
			wScroll = $(window).scrollTop(),
			//blogNav = $('.blog__nav'),
			offset = $('.blog__nav').offset(),
			menu = $('.blog__nav__items');

			if ( (offset.top - 70) < wScroll ) {
				menu.addClass('blog__nav__items-fixed');
				menu.css({width: menuWidth, left: offset.left + 9});
			} else {
				menu.removeClass('blog__nav__items-fixed');
				menu.removeAttr('style');
			}

		} // if
	};

	var swipeMenu = function () {
		$('.js-mobButton').on('click', function(e){

			$('.blog__nav').toggleClass('js-showMenu');
			$('.wrapper-blog').toggleClass('js-moveLeft');

		});
	};

	// public
	return {
		fixedmenu: function() {
			if ( $('.blog__nav').length ) {
				$(window).scroll(function(event) {
					moveMenu();
				});

				$(window).resize(function(event) {
					moveMenu();
				});
			}
		},

		openMenu: function(){
			if ( $('.blog__nav').length ) {
				swipeMenu();
			}
		}
	}

}()); // end main function

$(document).ready(function() {
	fixedBlogMenu.fixedmenu();
	fixedBlogMenu.openMenu();
});



var flipEffect = (function() {
	var flipBtn = $('.flip-btn'),
		flipReturn = $('.flip-btn-return'),
		container = $('.flipcontainer');

	return {
		init: function () {
			flipBtn.on('click', function(e){
				e.preventDefault();
				container.toggleClass('flip');
				flipBtn.toggleClass('hide');
				$('.tooltip').remove();
				$('.form').find('.error').removeClass("error");
				$('form')[0].reset();
			});
			flipReturn.on('click', function(e){
				e.preventDefault();
				container.toggleClass('flip');
				flipBtn.toggleClass('hide');
			});
			// переворачиваем форму по клику вне формы
			jDoc.mouseup(function (e) {
				if (container.has(e.target).length === 0){
					container.removeClass('flip');
					flipBtn.removeClass('hide');
				}
		});
	}
};
}());

flipEffect.init();
// создаем паралакс
var parallax = (function () {
	// берем элементы, которые будем двигать
	var	bg = doc.querySelector('.header__picture'), // берем блок с картинкой
		user = doc.querySelector('.header__user'), // блок с юзером
		sectionText = doc.querySelector('.header__icon'); // блок с Portfolio
	// возвращаем результат функции
	return {
		// move
		move: function (block,windowScroll,strafeAmount) {
			// block - какой блок двигаем
			// windowScroll - на сколько пролистали страницу
			// strafeAmount - коэффециент, на который будем делить для скорости
			// вычисляем значение для движения в процентах
			var strafe = windowScroll / -strafeAmount + '%';
			// переключаем нагрузку на видеокарту
			var transformString = 'translate3d(0,' + strafe + ',0)';
			// добавляем стиль к нашему блоку
			var style = block.style;
			// используем transform для смещения
			// в этом случае просчет осуществляется только один раз, что снижает нагрузку
			style.transform = transformString;
			style.webkitTransform = transformString;
			// присваиваем значению 'top' переменную strafe - это будет процент смещения
			style.top = strafe;
		},
		// init
		init: function(wScroll) {
			// двигаем 'bg' в зависимости от 'wScroll' и задаем коэффициет (чем он больше, тем медленнее двигается)

			this.move(bg, wScroll, 60);
			if (sectionText) {
			this.move(sectionText, wScroll, 30); }
			this.move(user, wScroll, 50);
		}
	}
}());

window.onscroll = function() {
	// узнаем на сколько прокрутили страницу
	var wScroll = window.pageYOffset;

	// вызываем parallax по скроллу
	parallax.init(wScroll);
};
var preloader = (function(){

	var percentsTotal = 1,
		preloader = $('.preloader');

	var imgPath = $('*').map(function(index, element) {
		var bground = $(element).css('background-image'),
			img = $(element).is('img'),
			path = '';

		if (bground != 'none') {
			path = bground.replace('url("', '').replace('")', '');
		}

		if (img) {
			path = $(element).attr('src');
		}

		if (path) return path
	})

	var setPercents = function(total, current) {
		var percents = Math.ceil(current / total * 100);

		$('.preloader__percents').text(percents);

		if (percents >= 100) {
			preloader.fadeOut();
		}
	}

	var loadImages = function(images) {

		if(!images.length) preloader.fadeOut();

		images.forEach(function(img, i, images) {
			var fakeImg = $('<img>', {
				attr : {
					src: img
				}
			});

			fakeImg.on('load error', function() {
				setPercents(images.length, percentsTotal);
				percentsTotal++;
			});
		});
	}

	return {
		init: function () {
			var imgs = imgPath.toArray();
			loadImages(imgs);
		}
	}

} () );

$(function () {
	preloader.init();
});
var showMenu =(function() {
	var menuBtn = $('#togglenav'),
			menu = 	$('#navigate'),
			menuItem = $('.navigate-top__link'),
			html = $('html'),
			animate = $('.nav-animate');

	var openMenu = function(){
		menuBtn.on('click', function(e) {
			menu.toggle(0, function(){
				menu.toggleClass('navigate-show');
				menuBtn.toggleClass('hamburger__icon-close');
				html.toggleClass('hideScroll');
				$('.navigate-top').addClass('navigate-top-animate');
			});
		});
	};

	return {
		init: function() {
			openMenu();
		}
	}
} () );

showMenu.init();
var slider = (function(){
	return {
		init: function(){

			var _this = this;

			// добавляем точки
			_this.makeDots();

			// жмем кнопки
			$('.slider__btn').on('click', function(e){
				e.preventDefault();

				var $this = $(this),
				items = $this.closest('.slider__container').find('.slider__item'),
				activeItem = items.filter('.active'),
				nextItem = activeItem.next(),
				prevItem = activeItem.prev(),
				firstItem = items.first(),
				lastSlide = items.last;

				if( $this.hasClass('slider__btn-next') ){

					if (nextItem.length) {
						_this.moveSlide(nextItem);
					} else {
						_this.moveSlide(firstItem);
					}

				} else {
					if (prevItem.length) {
						_this.moveSlide(prevItem);
					} else {
						_this.moveSlide(lastItem);
					}
				}
			});
		},

		// двигаем слайды
		moveSlide: function(slide) {

				var _this = this,
					container = slide.closest('.slider__container'),
					items = container.find('.slider__item'),
					active = items.filter('.active');

				items.addClass('hideSlide').removeClass('active showSlide');
				slide.removeClass('hideSlide').addClass('active showSlide');

				_this.activeDot(container.find('.slider__dots__items'));
		}, // moveSlide

		makeDots: function () {
			var _this = this,
				container = $('.slider__container'),
				dotHtml = '<li class="slider__dots__item"><button class="slider__dots__btn"></button></li>';

			container.each(function(){
				var $this = $(this),
				items = $this.find('.slider__item'),
				dotContainer = $this.find('.slider__dots__items');

				for (var i = 0; i < items.size(); i++) {
					dotContainer.append(dotHtml);
				}

				_this.activeDot(dotContainer);
			});
		}, // makeDots

		activeDot: function(container) {
			var items = container.closest('.slider__container').find('.slider__item');

			container
				.find('.slider__dots__item')
				.eq(items.filter('.active').index())
				.addClass('active')
				.siblings()
				.removeClass('active');
		} // activeDot
	} // return
}());

$(document).ready(function($) {
	if ($('.slider__container')) {
		slider.init();
	}
});
var formValidate = ( function() {

	var form = $('form'),
		valid = true;

	var validate = function(e) {
		var inputs = form.find('input, textarea');

		$.each(inputs, function(index, val) {
			var input = $(val),
				val = input.val(),
				formGroup = input.parent(),
				label = formGroup.find('label').text().toLowerCase(),
				textError = 'Вы не ввели ' + label,
				tooltip = $('<span class="tooltip">' + textError + '</span>'),
				tooltipRobot = $('<span class="tooltip">Роботам тут не место</span>');

			 if( val.length === 0 ) {
				formGroup.addClass('error');
				formGroup.find('.tooltip').remove();
				tooltip.appendTo(formGroup);
				input.on('focus', function(){
					formGroup.find('.tooltip').remove();
				});
				input.on('keydown', function(){
					formGroup.removeClass('error');
				});
				valid = false;

			 } // if
			 else{
				formGroup.removeClass('error');
				formGroup.find('.tooltip').remove();

				if($("form input[type='radio']").is(':checked') && $("form input[type='checkbox']").is(':checked')) {
					$('.form__radiogroup').find('.tooltip').remove();
					$("form input[type='radio'], form input[type='checkbox']").on('click', function() {
						$('.form__radiogroup').find('.tooltip').remove();
					});
				} else {
					$('.form__radiogroup').find('.tooltip').remove();
					tooltipRobot.appendTo($('.form__radiogroup'));
				}
			} // else

			if($("form input[type='radio']").is(':checked') && $("form input[type='checkbox']").is(':checked')) {
				$('.form__radiogroup').find('.tooltip').remove();
				$("form input[type='radio'], form input[type='checkbox']").on('click', function() {
					$('.form__radiogroup').find('.tooltip').remove();
				});
				valid = true;
			} else {
				$('.form__radiogroup').find('.tooltip').remove();
				tooltipRobot.appendTo($('.form__radiogroup'));
			}
		}); // each
		return valid;
	};

	var startValidate = function(e) {
		e.preventDefault();
		validate();
		if (valid === false) return false;

		console.log('go ajax');
	}

	var submitForm = function(e) {
		form.on('submit', startValidate);
	};

	return {
		init: function() {
			submitForm();
		}
	}
}());

formValidate.init();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImJsb2dtZW51LmpzIiwiYmx1ci5qcyIsImZpeGVkLWJsb2ctbWVudS5qcyIsImZsaXAuanMiLCJwYXJhbGF4LmpzIiwicHJlbG9hZGVyLmpzIiwic2hvd21lbnUuanMiLCJzbGlkZXIuanMiLCJ2YWxpZGF0ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgZG9jID0gZG9jdW1lbnQsXHJcblx0akRvYyA9ICQoZG9jdW1lbnQpO1xyXG5cclxudmFyIHN2ZzRldmVyeWJvZHkgPSAoZnVuY3Rpb24oKXtcclxuXHRzdmc0ZXZlcnlib2R5KCk7XHJcbn0oKSk7IiwiLy8g0L3QsNCy0LjQs9Cw0YbQuNGPINCyINCx0LvQvtCz0LVcclxuXHJcbnZhciBjaGVja1NlY3Rpb24gPSAoZnVuY3Rpb24gKCl7XHJcblx0Ly8gcHJpdmF0ZVxyXG5cdHZhciBmb2xsb3dCbG9nTGluayA9IGZ1bmN0aW9uKCl7XHJcblx0XHQkKCcuYmxvZ19fcG9zdCcpLmVhY2goZnVuY3Rpb24oaSwgZWwpe1xyXG5cdFx0XHRcdHZhciAkdGhpcyA9ICQodGhpcyksXHJcblx0XHRcdFx0dG9wRWRnZSA9ICR0aGlzLm9mZnNldCgpLnRvcCAtIDcwLFxyXG5cdFx0XHRcdGJvdHRvbUVkZ2UgPSB0b3BFZGdlICsgJHRoaXMuaGVpZ2h0KCksXHJcblx0XHRcdFx0d1Njcm9sbCA9ICQod2luZG93KS5zY3JvbGxUb3AoKTtcclxuXHJcblx0XHRcdFx0aWYgKHRvcEVkZ2UgPCB3U2Nyb2xsICYmIGJvdHRvbUVkZ2UgPiB3U2Nyb2xsKSB7XHJcblx0XHRcdFx0XHR2YXIgY3VycmVudElkID0gJHRoaXMuZGF0YSgnc2VjdGlvbicpLFxyXG5cdFx0XHRcdFx0XHRyZXFMaW5rID0gJCgnLmJsb2dfX25hdl9fbGluaycpLmZpbHRlcignW2hyZWYgPSBcIiMnICsgY3VycmVudElkICsgJ1wiXScpO1xyXG5cclxuXHRcdFx0XHRcdHJlcUxpbmsuY2xvc2VzdCgnLmJsb2dfX25hdl9faXRlbScpLmFkZENsYXNzKCdhY3RpdmUnKVxyXG5cdFx0XHRcdFx0XHQuc2libGluZ3MoKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHR9O1xyXG5cclxuXHQvLyBwdWJsaWNcclxuXHRyZXR1cm4ge1xyXG5cdFx0aW5pdDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdGZvbGxvd0Jsb2dMaW5rKCk7XHJcblx0XHR9XHJcblx0fVxyXG59KCkpO1xyXG5cclxuJCh3aW5kb3cpLnNjcm9sbChmdW5jdGlvbigpe1xyXG5cdGNoZWNrU2VjdGlvbi5pbml0KCk7XHJcbn0pOyIsInZhciBibHVyID0gZnVuY3Rpb24gKCkge1xyXG5cdHZhciB3cmFwcGVyID0gZG9jLnF1ZXJ5U2VsZWN0b3IoJy5ibHVyX193cmFwcGVyJyksXHJcblx0XHRmb3JtID0gZG9jLnF1ZXJ5U2VsZWN0b3IoJy5ibHVyX19mb3JtJyk7XHJcblxyXG5cdHJldHVybiBmdW5jdGlvbigpIHtcclxuXHRcdFx0aWYgKHdyYXBwZXIsIGZvcm0pIHtcclxuXHRcdFx0XHR2YXIgaW1nV2lkdGggPSBkb2MucXVlcnlTZWxlY3RvcignLmJsdXJfX2JhY2tncm91bmQnKS5vZmZzZXRXaWR0aCxcclxuXHRcdFx0XHRcdHBvc0xlZnQgPSAtd3JhcHBlci5vZmZzZXRMZWZ0LFxyXG5cdFx0XHRcdFx0cG9zVG9wID0gLXdyYXBwZXIub2Zmc2V0VG9wLFxyXG5cdFx0XHRcdFx0Ymx1ckNTUyA9IGZvcm0uc3R5bGU7XHJcblxyXG5cdFx0XHRcdGJsdXJDU1MuYmFja2dyb3VuZFNpemUgPSBpbWdXaWR0aCArICdweCAnICsgJ2F1dG8nO1xyXG5cdFx0XHRcdGJsdXJDU1MuYmFja2dyb3VuZFBvc2l0aW9uID0gcG9zTGVmdCArICdweCAnICsgcG9zVG9wICsgJ3B4JztcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG59O1xyXG5cclxudmFyIG1ha2VCbHVyID0gYmx1cigpO1xyXG5cclxubWFrZUJsdXIoKTtcclxuXHJcbndpbmRvdy5vbnJlc2l6ZSA9IGZ1bmN0aW9uICgpIHtcclxuXHRtYWtlQmx1cigpO1xyXG59OyIsInZhciBmaXhlZEJsb2dNZW51ID0gKGZ1bmN0aW9uICgpIHtcclxuXHQvLyBwcml2YXRlXHJcblx0dmFyIG1vdmVNZW51ID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0dmFyIHdXaWR0aCA9ICQod2luZG93KS53aWR0aCgpO1xyXG5cclxuXHRcdGlmICggd1dpZHRoID4gNzY4ICkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyh3V2lkdGgpO1xyXG5cdFx0XHR2YXIgbWVudVdpZHRoID0gJCgnLmJsb2dfX25hdl9faXRlbXMnKS53aWR0aCgpLFxyXG5cdFx0XHR3U2Nyb2xsID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpLFxyXG5cdFx0XHQvL2Jsb2dOYXYgPSAkKCcuYmxvZ19fbmF2JyksXHJcblx0XHRcdG9mZnNldCA9ICQoJy5ibG9nX19uYXYnKS5vZmZzZXQoKSxcclxuXHRcdFx0bWVudSA9ICQoJy5ibG9nX19uYXZfX2l0ZW1zJyk7XHJcblxyXG5cdFx0XHRpZiAoIChvZmZzZXQudG9wIC0gNzApIDwgd1Njcm9sbCApIHtcclxuXHRcdFx0XHRtZW51LmFkZENsYXNzKCdibG9nX19uYXZfX2l0ZW1zLWZpeGVkJyk7XHJcblx0XHRcdFx0bWVudS5jc3Moe3dpZHRoOiBtZW51V2lkdGgsIGxlZnQ6IG9mZnNldC5sZWZ0ICsgOX0pO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdG1lbnUucmVtb3ZlQ2xhc3MoJ2Jsb2dfX25hdl9faXRlbXMtZml4ZWQnKTtcclxuXHRcdFx0XHRtZW51LnJlbW92ZUF0dHIoJ3N0eWxlJyk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9IC8vIGlmXHJcblx0fTtcclxuXHJcblx0dmFyIHN3aXBlTWVudSA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdCQoJy5qcy1tb2JCdXR0b24nKS5vbignY2xpY2snLCBmdW5jdGlvbihlKXtcclxuXHJcblx0XHRcdCQoJy5ibG9nX19uYXYnKS50b2dnbGVDbGFzcygnanMtc2hvd01lbnUnKTtcclxuXHRcdFx0JCgnLndyYXBwZXItYmxvZycpLnRvZ2dsZUNsYXNzKCdqcy1tb3ZlTGVmdCcpO1xyXG5cclxuXHRcdH0pO1xyXG5cdH07XHJcblxyXG5cdC8vIHB1YmxpY1xyXG5cdHJldHVybiB7XHJcblx0XHRmaXhlZG1lbnU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRpZiAoICQoJy5ibG9nX19uYXYnKS5sZW5ndGggKSB7XHJcblx0XHRcdFx0JCh3aW5kb3cpLnNjcm9sbChmdW5jdGlvbihldmVudCkge1xyXG5cdFx0XHRcdFx0bW92ZU1lbnUoKTtcclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0JCh3aW5kb3cpLnJlc2l6ZShmdW5jdGlvbihldmVudCkge1xyXG5cdFx0XHRcdFx0bW92ZU1lbnUoKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHJcblx0XHRvcGVuTWVudTogZnVuY3Rpb24oKXtcclxuXHRcdFx0aWYgKCAkKCcuYmxvZ19fbmF2JykubGVuZ3RoICkge1xyXG5cdFx0XHRcdHN3aXBlTWVudSgpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxufSgpKTsgLy8gZW5kIG1haW4gZnVuY3Rpb25cclxuXHJcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xyXG5cdGZpeGVkQmxvZ01lbnUuZml4ZWRtZW51KCk7XHJcblx0Zml4ZWRCbG9nTWVudS5vcGVuTWVudSgpO1xyXG59KTtcclxuXHJcblxyXG4iLCJ2YXIgZmxpcEVmZmVjdCA9IChmdW5jdGlvbigpIHtcclxuXHR2YXIgZmxpcEJ0biA9ICQoJy5mbGlwLWJ0bicpLFxyXG5cdFx0ZmxpcFJldHVybiA9ICQoJy5mbGlwLWJ0bi1yZXR1cm4nKSxcclxuXHRcdGNvbnRhaW5lciA9ICQoJy5mbGlwY29udGFpbmVyJyk7XHJcblxyXG5cdHJldHVybiB7XHJcblx0XHRpbml0OiBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGZsaXBCdG4ub24oJ2NsaWNrJywgZnVuY3Rpb24oZSl7XHJcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRcdGNvbnRhaW5lci50b2dnbGVDbGFzcygnZmxpcCcpO1xyXG5cdFx0XHRcdGZsaXBCdG4udG9nZ2xlQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdFx0XHQkKCcudG9vbHRpcCcpLnJlbW92ZSgpO1xyXG5cdFx0XHRcdCQoJy5mb3JtJykuZmluZCgnLmVycm9yJykucmVtb3ZlQ2xhc3MoXCJlcnJvclwiKTtcclxuXHRcdFx0XHQkKCdmb3JtJylbMF0ucmVzZXQoKTtcclxuXHRcdFx0fSk7XHJcblx0XHRcdGZsaXBSZXR1cm4ub24oJ2NsaWNrJywgZnVuY3Rpb24oZSl7XHJcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRcdGNvbnRhaW5lci50b2dnbGVDbGFzcygnZmxpcCcpO1xyXG5cdFx0XHRcdGZsaXBCdG4udG9nZ2xlQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdFx0fSk7XHJcblx0XHRcdC8vINC/0LXRgNC10LLQvtGA0LDRh9C40LLQsNC10Lwg0YTQvtGA0LzRgyDQv9C+INC60LvQuNC60YMg0LLQvdC1INGE0L7RgNC80YtcclxuXHRcdFx0akRvYy5tb3VzZXVwKGZ1bmN0aW9uIChlKSB7XHJcblx0XHRcdFx0aWYgKGNvbnRhaW5lci5oYXMoZS50YXJnZXQpLmxlbmd0aCA9PT0gMCl7XHJcblx0XHRcdFx0XHRjb250YWluZXIucmVtb3ZlQ2xhc3MoJ2ZsaXAnKTtcclxuXHRcdFx0XHRcdGZsaXBCdG4ucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcbn07XHJcbn0oKSk7XHJcblxyXG5mbGlwRWZmZWN0LmluaXQoKTsiLCIvLyDRgdC+0LfQtNCw0LXQvCDQv9Cw0YDQsNC70LDQutGBXHJcbnZhciBwYXJhbGxheCA9IChmdW5jdGlvbiAoKSB7XHJcblx0Ly8g0LHQtdGA0LXQvCDRjdC70LXQvNC10L3RgtGLLCDQutC+0YLQvtGA0YvQtSDQsdGD0LTQtdC8INC00LLQuNCz0LDRgtGMXHJcblx0dmFyXHRiZyA9IGRvYy5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19waWN0dXJlJyksIC8vINCx0LXRgNC10Lwg0LHQu9C+0Log0YEg0LrQsNGA0YLQuNC90LrQvtC5XHJcblx0XHR1c2VyID0gZG9jLnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX3VzZXInKSwgLy8g0LHQu9C+0Log0YEg0Y7Qt9C10YDQvtC8XHJcblx0XHRzZWN0aW9uVGV4dCA9IGRvYy5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19pY29uJyk7IC8vINCx0LvQvtC6INGBIFBvcnRmb2xpb1xyXG5cdC8vINCy0L7Qt9Cy0YDQsNGJ0LDQtdC8INGA0LXQt9GD0LvRjNGC0LDRgiDRhNGD0L3QutGG0LjQuFxyXG5cdHJldHVybiB7XHJcblx0XHQvLyBtb3ZlXHJcblx0XHRtb3ZlOiBmdW5jdGlvbiAoYmxvY2ssd2luZG93U2Nyb2xsLHN0cmFmZUFtb3VudCkge1xyXG5cdFx0XHQvLyBibG9jayAtINC60LDQutC+0Lkg0LHQu9C+0Log0LTQstC40LPQsNC10LxcclxuXHRcdFx0Ly8gd2luZG93U2Nyb2xsIC0g0L3QsCDRgdC60L7Qu9GM0LrQviDQv9GA0L7Qu9C40YHRgtCw0LvQuCDRgdGC0YDQsNC90LjRhtGDXHJcblx0XHRcdC8vIHN0cmFmZUFtb3VudCAtINC60L7RjdGE0YTQtdGG0LjQtdC90YIsINC90LAg0LrQvtGC0L7RgNGL0Lkg0LHRg9C00LXQvCDQtNC10LvQuNGC0Ywg0LTQu9GPINGB0LrQvtGA0L7RgdGC0LhcclxuXHRcdFx0Ly8g0LLRi9GH0LjRgdC70Y/QtdC8INC30L3QsNGH0LXQvdC40LUg0LTQu9GPINC00LLQuNC20LXQvdC40Y8g0LIg0L/RgNC+0YbQtdC90YLQsNGFXHJcblx0XHRcdHZhciBzdHJhZmUgPSB3aW5kb3dTY3JvbGwgLyAtc3RyYWZlQW1vdW50ICsgJyUnO1xyXG5cdFx0XHQvLyDQv9C10YDQtdC60LvRjtGH0LDQtdC8INC90LDQs9GA0YPQt9C60YMg0L3QsCDQstC40LTQtdC+0LrQsNGA0YLRg1xyXG5cdFx0XHR2YXIgdHJhbnNmb3JtU3RyaW5nID0gJ3RyYW5zbGF0ZTNkKDAsJyArIHN0cmFmZSArICcsMCknO1xyXG5cdFx0XHQvLyDQtNC+0LHQsNCy0LvRj9C10Lwg0YHRgtC40LvRjCDQuiDQvdCw0YjQtdC80YMg0LHQu9C+0LrRg1xyXG5cdFx0XHR2YXIgc3R5bGUgPSBibG9jay5zdHlsZTtcclxuXHRcdFx0Ly8g0LjRgdC/0L7Qu9GM0LfRg9C10LwgdHJhbnNmb3JtINC00LvRjyDRgdC80LXRidC10L3QuNGPXHJcblx0XHRcdC8vINCyINGN0YLQvtC8INGB0LvRg9GH0LDQtSDQv9GA0L7RgdGH0LXRgiDQvtGB0YPRidC10YHRgtCy0LvRj9C10YLRgdGPINGC0L7Qu9GM0LrQviDQvtC00LjQvSDRgNCw0LcsINGH0YLQviDRgdC90LjQttCw0LXRgiDQvdCw0LPRgNGD0LfQutGDXHJcblx0XHRcdHN0eWxlLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVN0cmluZztcclxuXHRcdFx0c3R5bGUud2Via2l0VHJhbnNmb3JtID0gdHJhbnNmb3JtU3RyaW5nO1xyXG5cdFx0XHQvLyDQv9GA0LjRgdCy0LDQuNCy0LDQtdC8INC30L3QsNGH0LXQvdC40Y4gJ3RvcCcg0L/QtdGA0LXQvNC10L3QvdGD0Y4gc3RyYWZlIC0g0Y3RgtC+INCx0YPQtNC10YIg0L/RgNC+0YbQtdC90YIg0YHQvNC10YnQtdC90LjRj1xyXG5cdFx0XHRzdHlsZS50b3AgPSBzdHJhZmU7XHJcblx0XHR9LFxyXG5cdFx0Ly8gaW5pdFxyXG5cdFx0aW5pdDogZnVuY3Rpb24od1Njcm9sbCkge1xyXG5cdFx0XHQvLyDQtNCy0LjQs9Cw0LXQvCAnYmcnINCyINC30LDQstC40YHQuNC80L7RgdGC0Lgg0L7RgiAnd1Njcm9sbCcg0Lgg0LfQsNC00LDQtdC8INC60L7RjdGE0YTQuNGG0LjQtdGCICjRh9C10Lwg0L7QvSDQsdC+0LvRjNGI0LUsINGC0LXQvCDQvNC10LTQu9C10L3QvdC10LUg0LTQstC40LPQsNC10YLRgdGPKVxyXG5cclxuXHRcdFx0dGhpcy5tb3ZlKGJnLCB3U2Nyb2xsLCA2MCk7XHJcblx0XHRcdGlmIChzZWN0aW9uVGV4dCkge1xyXG5cdFx0XHR0aGlzLm1vdmUoc2VjdGlvblRleHQsIHdTY3JvbGwsIDMwKTsgfVxyXG5cdFx0XHR0aGlzLm1vdmUodXNlciwgd1Njcm9sbCwgNTApO1xyXG5cdFx0fVxyXG5cdH1cclxufSgpKTtcclxuXHJcbndpbmRvdy5vbnNjcm9sbCA9IGZ1bmN0aW9uKCkge1xyXG5cdC8vINGD0LfQvdCw0LXQvCDQvdCwINGB0LrQvtC70YzQutC+INC/0YDQvtC60YDRg9GC0LjQu9C4INGB0YLRgNCw0L3QuNGG0YNcclxuXHR2YXIgd1Njcm9sbCA9IHdpbmRvdy5wYWdlWU9mZnNldDtcclxuXHJcblx0Ly8g0LLRi9C30YvQstCw0LXQvCBwYXJhbGxheCDQv9C+INGB0LrRgNC+0LvQu9GDXHJcblx0cGFyYWxsYXguaW5pdCh3U2Nyb2xsKTtcclxufTsiLCJ2YXIgcHJlbG9hZGVyID0gKGZ1bmN0aW9uKCl7XHJcblxyXG5cdHZhciBwZXJjZW50c1RvdGFsID0gMSxcclxuXHRcdHByZWxvYWRlciA9ICQoJy5wcmVsb2FkZXInKTtcclxuXHJcblx0dmFyIGltZ1BhdGggPSAkKCcqJykubWFwKGZ1bmN0aW9uKGluZGV4LCBlbGVtZW50KSB7XHJcblx0XHR2YXIgYmdyb3VuZCA9ICQoZWxlbWVudCkuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJyksXHJcblx0XHRcdGltZyA9ICQoZWxlbWVudCkuaXMoJ2ltZycpLFxyXG5cdFx0XHRwYXRoID0gJyc7XHJcblxyXG5cdFx0aWYgKGJncm91bmQgIT0gJ25vbmUnKSB7XHJcblx0XHRcdHBhdGggPSBiZ3JvdW5kLnJlcGxhY2UoJ3VybChcIicsICcnKS5yZXBsYWNlKCdcIiknLCAnJyk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGltZykge1xyXG5cdFx0XHRwYXRoID0gJChlbGVtZW50KS5hdHRyKCdzcmMnKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAocGF0aCkgcmV0dXJuIHBhdGhcclxuXHR9KVxyXG5cclxuXHR2YXIgc2V0UGVyY2VudHMgPSBmdW5jdGlvbih0b3RhbCwgY3VycmVudCkge1xyXG5cdFx0dmFyIHBlcmNlbnRzID0gTWF0aC5jZWlsKGN1cnJlbnQgLyB0b3RhbCAqIDEwMCk7XHJcblxyXG5cdFx0JCgnLnByZWxvYWRlcl9fcGVyY2VudHMnKS50ZXh0KHBlcmNlbnRzKTtcclxuXHJcblx0XHRpZiAocGVyY2VudHMgPj0gMTAwKSB7XHJcblx0XHRcdHByZWxvYWRlci5mYWRlT3V0KCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHR2YXIgbG9hZEltYWdlcyA9IGZ1bmN0aW9uKGltYWdlcykge1xyXG5cclxuXHRcdGlmKCFpbWFnZXMubGVuZ3RoKSBwcmVsb2FkZXIuZmFkZU91dCgpO1xyXG5cclxuXHRcdGltYWdlcy5mb3JFYWNoKGZ1bmN0aW9uKGltZywgaSwgaW1hZ2VzKSB7XHJcblx0XHRcdHZhciBmYWtlSW1nID0gJCgnPGltZz4nLCB7XHJcblx0XHRcdFx0YXR0ciA6IHtcclxuXHRcdFx0XHRcdHNyYzogaW1nXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdGZha2VJbWcub24oJ2xvYWQgZXJyb3InLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRzZXRQZXJjZW50cyhpbWFnZXMubGVuZ3RoLCBwZXJjZW50c1RvdGFsKTtcclxuXHRcdFx0XHRwZXJjZW50c1RvdGFsKys7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4ge1xyXG5cdFx0aW5pdDogZnVuY3Rpb24gKCkge1xyXG5cdFx0XHR2YXIgaW1ncyA9IGltZ1BhdGgudG9BcnJheSgpO1xyXG5cdFx0XHRsb2FkSW1hZ2VzKGltZ3MpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcbn0gKCkgKTtcclxuXHJcbiQoZnVuY3Rpb24gKCkge1xyXG5cdHByZWxvYWRlci5pbml0KCk7XHJcbn0pOyIsInZhciBzaG93TWVudSA9KGZ1bmN0aW9uKCkge1xyXG5cdHZhciBtZW51QnRuID0gJCgnI3RvZ2dsZW5hdicpLFxyXG5cdFx0XHRtZW51ID0gXHQkKCcjbmF2aWdhdGUnKSxcclxuXHRcdFx0bWVudUl0ZW0gPSAkKCcubmF2aWdhdGUtdG9wX19saW5rJyksXHJcblx0XHRcdGh0bWwgPSAkKCdodG1sJyksXHJcblx0XHRcdGFuaW1hdGUgPSAkKCcubmF2LWFuaW1hdGUnKTtcclxuXHJcblx0dmFyIG9wZW5NZW51ID0gZnVuY3Rpb24oKXtcclxuXHRcdG1lbnVCdG4ub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG5cdFx0XHRtZW51LnRvZ2dsZSgwLCBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdG1lbnUudG9nZ2xlQ2xhc3MoJ25hdmlnYXRlLXNob3cnKTtcclxuXHRcdFx0XHRtZW51QnRuLnRvZ2dsZUNsYXNzKCdoYW1idXJnZXJfX2ljb24tY2xvc2UnKTtcclxuXHRcdFx0XHRodG1sLnRvZ2dsZUNsYXNzKCdoaWRlU2Nyb2xsJyk7XHJcblx0XHRcdFx0JCgnLm5hdmlnYXRlLXRvcCcpLmFkZENsYXNzKCduYXZpZ2F0ZS10b3AtYW5pbWF0ZScpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdH07XHJcblxyXG5cdHJldHVybiB7XHJcblx0XHRpbml0OiBmdW5jdGlvbigpIHtcclxuXHRcdFx0b3Blbk1lbnUoKTtcclxuXHRcdH1cclxuXHR9XHJcbn0gKCkgKTtcclxuXHJcbnNob3dNZW51LmluaXQoKTsiLCJ2YXIgc2xpZGVyID0gKGZ1bmN0aW9uKCl7XHJcblx0cmV0dXJuIHtcclxuXHRcdGluaXQ6IGZ1bmN0aW9uKCl7XHJcblxyXG5cdFx0XHR2YXIgX3RoaXMgPSB0aGlzO1xyXG5cclxuXHRcdFx0Ly8g0LTQvtCx0LDQstC70Y/QtdC8INGC0L7Rh9C60LhcclxuXHRcdFx0X3RoaXMubWFrZURvdHMoKTtcclxuXHJcblx0XHRcdC8vINC20LzQtdC8INC60L3QvtC/0LrQuFxyXG5cdFx0XHQkKCcuc2xpZGVyX19idG4nKS5vbignY2xpY2snLCBmdW5jdGlvbihlKXtcclxuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG5cdFx0XHRcdHZhciAkdGhpcyA9ICQodGhpcyksXHJcblx0XHRcdFx0aXRlbXMgPSAkdGhpcy5jbG9zZXN0KCcuc2xpZGVyX19jb250YWluZXInKS5maW5kKCcuc2xpZGVyX19pdGVtJyksXHJcblx0XHRcdFx0YWN0aXZlSXRlbSA9IGl0ZW1zLmZpbHRlcignLmFjdGl2ZScpLFxyXG5cdFx0XHRcdG5leHRJdGVtID0gYWN0aXZlSXRlbS5uZXh0KCksXHJcblx0XHRcdFx0cHJldkl0ZW0gPSBhY3RpdmVJdGVtLnByZXYoKSxcclxuXHRcdFx0XHRmaXJzdEl0ZW0gPSBpdGVtcy5maXJzdCgpLFxyXG5cdFx0XHRcdGxhc3RTbGlkZSA9IGl0ZW1zLmxhc3Q7XHJcblxyXG5cdFx0XHRcdGlmKCAkdGhpcy5oYXNDbGFzcygnc2xpZGVyX19idG4tbmV4dCcpICl7XHJcblxyXG5cdFx0XHRcdFx0aWYgKG5leHRJdGVtLmxlbmd0aCkge1xyXG5cdFx0XHRcdFx0XHRfdGhpcy5tb3ZlU2xpZGUobmV4dEl0ZW0pO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0X3RoaXMubW92ZVNsaWRlKGZpcnN0SXRlbSk7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRpZiAocHJldkl0ZW0ubGVuZ3RoKSB7XHJcblx0XHRcdFx0XHRcdF90aGlzLm1vdmVTbGlkZShwcmV2SXRlbSk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRfdGhpcy5tb3ZlU2xpZGUobGFzdEl0ZW0pO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9LFxyXG5cclxuXHRcdC8vINC00LLQuNCz0LDQtdC8INGB0LvQsNC50LTRi1xyXG5cdFx0bW92ZVNsaWRlOiBmdW5jdGlvbihzbGlkZSkge1xyXG5cclxuXHRcdFx0XHR2YXIgX3RoaXMgPSB0aGlzLFxyXG5cdFx0XHRcdFx0Y29udGFpbmVyID0gc2xpZGUuY2xvc2VzdCgnLnNsaWRlcl9fY29udGFpbmVyJyksXHJcblx0XHRcdFx0XHRpdGVtcyA9IGNvbnRhaW5lci5maW5kKCcuc2xpZGVyX19pdGVtJyksXHJcblx0XHRcdFx0XHRhY3RpdmUgPSBpdGVtcy5maWx0ZXIoJy5hY3RpdmUnKTtcclxuXHJcblx0XHRcdFx0aXRlbXMuYWRkQ2xhc3MoJ2hpZGVTbGlkZScpLnJlbW92ZUNsYXNzKCdhY3RpdmUgc2hvd1NsaWRlJyk7XHJcblx0XHRcdFx0c2xpZGUucmVtb3ZlQ2xhc3MoJ2hpZGVTbGlkZScpLmFkZENsYXNzKCdhY3RpdmUgc2hvd1NsaWRlJyk7XHJcblxyXG5cdFx0XHRcdF90aGlzLmFjdGl2ZURvdChjb250YWluZXIuZmluZCgnLnNsaWRlcl9fZG90c19faXRlbXMnKSk7XHJcblx0XHR9LCAvLyBtb3ZlU2xpZGVcclxuXHJcblx0XHRtYWtlRG90czogZnVuY3Rpb24gKCkge1xyXG5cdFx0XHR2YXIgX3RoaXMgPSB0aGlzLFxyXG5cdFx0XHRcdGNvbnRhaW5lciA9ICQoJy5zbGlkZXJfX2NvbnRhaW5lcicpLFxyXG5cdFx0XHRcdGRvdEh0bWwgPSAnPGxpIGNsYXNzPVwic2xpZGVyX19kb3RzX19pdGVtXCI+PGJ1dHRvbiBjbGFzcz1cInNsaWRlcl9fZG90c19fYnRuXCI+PC9idXR0b24+PC9saT4nO1xyXG5cclxuXHRcdFx0Y29udGFpbmVyLmVhY2goZnVuY3Rpb24oKXtcclxuXHRcdFx0XHR2YXIgJHRoaXMgPSAkKHRoaXMpLFxyXG5cdFx0XHRcdGl0ZW1zID0gJHRoaXMuZmluZCgnLnNsaWRlcl9faXRlbScpLFxyXG5cdFx0XHRcdGRvdENvbnRhaW5lciA9ICR0aGlzLmZpbmQoJy5zbGlkZXJfX2RvdHNfX2l0ZW1zJyk7XHJcblxyXG5cdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgaXRlbXMuc2l6ZSgpOyBpKyspIHtcclxuXHRcdFx0XHRcdGRvdENvbnRhaW5lci5hcHBlbmQoZG90SHRtbCk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRfdGhpcy5hY3RpdmVEb3QoZG90Q29udGFpbmVyKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9LCAvLyBtYWtlRG90c1xyXG5cclxuXHRcdGFjdGl2ZURvdDogZnVuY3Rpb24oY29udGFpbmVyKSB7XHJcblx0XHRcdHZhciBpdGVtcyA9IGNvbnRhaW5lci5jbG9zZXN0KCcuc2xpZGVyX19jb250YWluZXInKS5maW5kKCcuc2xpZGVyX19pdGVtJyk7XHJcblxyXG5cdFx0XHRjb250YWluZXJcclxuXHRcdFx0XHQuZmluZCgnLnNsaWRlcl9fZG90c19faXRlbScpXHJcblx0XHRcdFx0LmVxKGl0ZW1zLmZpbHRlcignLmFjdGl2ZScpLmluZGV4KCkpXHJcblx0XHRcdFx0LmFkZENsYXNzKCdhY3RpdmUnKVxyXG5cdFx0XHRcdC5zaWJsaW5ncygpXHJcblx0XHRcdFx0LnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuXHRcdH0gLy8gYWN0aXZlRG90XHJcblx0fSAvLyByZXR1cm5cclxufSgpKTtcclxuXHJcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCQpIHtcclxuXHRpZiAoJCgnLnNsaWRlcl9fY29udGFpbmVyJykpIHtcclxuXHRcdHNsaWRlci5pbml0KCk7XHJcblx0fVxyXG59KTsiLCJ2YXIgZm9ybVZhbGlkYXRlID0gKCBmdW5jdGlvbigpIHtcclxuXHJcblx0dmFyIGZvcm0gPSAkKCdmb3JtJyksXHJcblx0XHR2YWxpZCA9IHRydWU7XHJcblxyXG5cdHZhciB2YWxpZGF0ZSA9IGZ1bmN0aW9uKGUpIHtcclxuXHRcdHZhciBpbnB1dHMgPSBmb3JtLmZpbmQoJ2lucHV0LCB0ZXh0YXJlYScpO1xyXG5cclxuXHRcdCQuZWFjaChpbnB1dHMsIGZ1bmN0aW9uKGluZGV4LCB2YWwpIHtcclxuXHRcdFx0dmFyIGlucHV0ID0gJCh2YWwpLFxyXG5cdFx0XHRcdHZhbCA9IGlucHV0LnZhbCgpLFxyXG5cdFx0XHRcdGZvcm1Hcm91cCA9IGlucHV0LnBhcmVudCgpLFxyXG5cdFx0XHRcdGxhYmVsID0gZm9ybUdyb3VwLmZpbmQoJ2xhYmVsJykudGV4dCgpLnRvTG93ZXJDYXNlKCksXHJcblx0XHRcdFx0dGV4dEVycm9yID0gJ9CS0Ysg0L3QtSDQstCy0LXQu9C4ICcgKyBsYWJlbCxcclxuXHRcdFx0XHR0b29sdGlwID0gJCgnPHNwYW4gY2xhc3M9XCJ0b29sdGlwXCI+JyArIHRleHRFcnJvciArICc8L3NwYW4+JyksXHJcblx0XHRcdFx0dG9vbHRpcFJvYm90ID0gJCgnPHNwYW4gY2xhc3M9XCJ0b29sdGlwXCI+0KDQvtCx0L7RgtCw0Lwg0YLRg9GCINC90LUg0LzQtdGB0YLQvjwvc3Bhbj4nKTtcclxuXHJcblx0XHRcdCBpZiggdmFsLmxlbmd0aCA9PT0gMCApIHtcclxuXHRcdFx0XHRmb3JtR3JvdXAuYWRkQ2xhc3MoJ2Vycm9yJyk7XHJcblx0XHRcdFx0Zm9ybUdyb3VwLmZpbmQoJy50b29sdGlwJykucmVtb3ZlKCk7XHJcblx0XHRcdFx0dG9vbHRpcC5hcHBlbmRUbyhmb3JtR3JvdXApO1xyXG5cdFx0XHRcdGlucHV0Lm9uKCdmb2N1cycsIGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0XHRmb3JtR3JvdXAuZmluZCgnLnRvb2x0aXAnKS5yZW1vdmUoKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHRpbnB1dC5vbigna2V5ZG93bicsIGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0XHRmb3JtR3JvdXAucmVtb3ZlQ2xhc3MoJ2Vycm9yJyk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0dmFsaWQgPSBmYWxzZTtcclxuXHJcblx0XHRcdCB9IC8vIGlmXHJcblx0XHRcdCBlbHNle1xyXG5cdFx0XHRcdGZvcm1Hcm91cC5yZW1vdmVDbGFzcygnZXJyb3InKTtcclxuXHRcdFx0XHRmb3JtR3JvdXAuZmluZCgnLnRvb2x0aXAnKS5yZW1vdmUoKTtcclxuXHJcblx0XHRcdFx0aWYoJChcImZvcm0gaW5wdXRbdHlwZT0ncmFkaW8nXVwiKS5pcygnOmNoZWNrZWQnKSAmJiAkKFwiZm9ybSBpbnB1dFt0eXBlPSdjaGVja2JveCddXCIpLmlzKCc6Y2hlY2tlZCcpKSB7XHJcblx0XHRcdFx0XHQkKCcuZm9ybV9fcmFkaW9ncm91cCcpLmZpbmQoJy50b29sdGlwJykucmVtb3ZlKCk7XHJcblx0XHRcdFx0XHQkKFwiZm9ybSBpbnB1dFt0eXBlPSdyYWRpbyddLCBmb3JtIGlucHV0W3R5cGU9J2NoZWNrYm94J11cIikub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdCQoJy5mb3JtX19yYWRpb2dyb3VwJykuZmluZCgnLnRvb2x0aXAnKS5yZW1vdmUoKTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHQkKCcuZm9ybV9fcmFkaW9ncm91cCcpLmZpbmQoJy50b29sdGlwJykucmVtb3ZlKCk7XHJcblx0XHRcdFx0XHR0b29sdGlwUm9ib3QuYXBwZW5kVG8oJCgnLmZvcm1fX3JhZGlvZ3JvdXAnKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IC8vIGVsc2VcclxuXHJcblx0XHRcdGlmKCQoXCJmb3JtIGlucHV0W3R5cGU9J3JhZGlvJ11cIikuaXMoJzpjaGVja2VkJykgJiYgJChcImZvcm0gaW5wdXRbdHlwZT0nY2hlY2tib3gnXVwiKS5pcygnOmNoZWNrZWQnKSkge1xyXG5cdFx0XHRcdCQoJy5mb3JtX19yYWRpb2dyb3VwJykuZmluZCgnLnRvb2x0aXAnKS5yZW1vdmUoKTtcclxuXHRcdFx0XHQkKFwiZm9ybSBpbnB1dFt0eXBlPSdyYWRpbyddLCBmb3JtIGlucHV0W3R5cGU9J2NoZWNrYm94J11cIikub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHQkKCcuZm9ybV9fcmFkaW9ncm91cCcpLmZpbmQoJy50b29sdGlwJykucmVtb3ZlKCk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0dmFsaWQgPSB0cnVlO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdCQoJy5mb3JtX19yYWRpb2dyb3VwJykuZmluZCgnLnRvb2x0aXAnKS5yZW1vdmUoKTtcclxuXHRcdFx0XHR0b29sdGlwUm9ib3QuYXBwZW5kVG8oJCgnLmZvcm1fX3JhZGlvZ3JvdXAnKSk7XHJcblx0XHRcdH1cclxuXHRcdH0pOyAvLyBlYWNoXHJcblx0XHRyZXR1cm4gdmFsaWQ7XHJcblx0fTtcclxuXHJcblx0dmFyIHN0YXJ0VmFsaWRhdGUgPSBmdW5jdGlvbihlKSB7XHJcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHR2YWxpZGF0ZSgpO1xyXG5cdFx0aWYgKHZhbGlkID09PSBmYWxzZSkgcmV0dXJuIGZhbHNlO1xyXG5cclxuXHRcdGNvbnNvbGUubG9nKCdnbyBhamF4Jyk7XHJcblx0fVxyXG5cclxuXHR2YXIgc3VibWl0Rm9ybSA9IGZ1bmN0aW9uKGUpIHtcclxuXHRcdGZvcm0ub24oJ3N1Ym1pdCcsIHN0YXJ0VmFsaWRhdGUpO1xyXG5cdH07XHJcblxyXG5cdHJldHVybiB7XHJcblx0XHRpbml0OiBmdW5jdGlvbigpIHtcclxuXHRcdFx0c3VibWl0Rm9ybSgpO1xyXG5cdFx0fVxyXG5cdH1cclxufSgpKTtcclxuXHJcbmZvcm1WYWxpZGF0ZS5pbml0KCk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
