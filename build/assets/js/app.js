'use strict';

var doc = document,
	jDoc = $(document);

var svg4everybody = (function(){
	svg4everybody();
}());
// навигация в блоге

var checkSection = (function (){
	// private
	var followBlogLink = function(edge){
		$('.blog__post').each(function(i, el){
				var $this = $(this),
				topEdge = $this.offset().top - edge,
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
			var wWidth = $(window).width();
			if ( wWidth > 768 ) {
				followBlogLink(70);
			} else {
				followBlogLink(200);
			}
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
					moveMenu();
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
	$(window).scroll(function(event) {
		fixedBlogMenu.fixedmenu();
	});
	$(window).resize(function(event) {
		fixedBlogMenu.fixedmenu();
	});
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
(function(){
	var formValidate = {
		doit: function(){
			this.listeners();
		},

		listeners: function(){
			$('#mailForm').on('submit', formValidate.mailme);
			$('#loginForm').on('submit', formValidate.loginValid);
		},

		loginValid: function(e){
			e.preventDefault();
			var form = $(this);
			if ( formValidate.valid(form) === false ) return false;

			console.log('come in');
		},

		mailme: function(e){
			e.preventDefault();
			var form = $(this);
			if ( formValidate.valid(form) === false ) return false;

			var formdata = form.serialize();

			console.log(formdata);
			$.ajax({
				url: 'assets/php/mail-process.php',
				type: 'POST',
				data: formdata
			})
			.done(function(msg) {
				if (msg === 'OK') {
					console.log('OK');
					form.trigger("reset");
				} else {
					$('input#mailMail').parents('.form__text').addClass('error');
					$('<span class="tooltip">' + msg + '</span>').appendTo('.error');
				}
			})
			.fail(function() {
				console.log("error");
			})
			.always(function() {
				console.log("complete");
			});

		},

		valid: function(form){
			var inputs = form.find('input, textarea'),
				checks = form.find('input:checkbox, input:radio'),
				checksOk = form.find('input:checked'),
				valid = true;

			$.each(inputs, function(index, val) {
				var input = $(val),
				val = input.val(),
				formGroup = input.parents('.form__text, .form__text_icon'),
				label = formGroup.find('label').text().toLowerCase(),
				textError = 'Вы не ввели ' + label,
				tooltip = $('<span class="tooltip">' + textError + '</span>');

				if (val.length === 0){
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
				} else {
					formGroup.removeClass('error');
					formGroup.find('.tooltip').remove();
				};
			});

			var checkGroup = $('.form__checks'),
				tooltip = $('<span class="tooltip">Роботам тут не место</span>');

			if (checks.length > 0) {

				if (checksOk.length < 2) {
					console.log('check someone');
					checkGroup.find('.tooltip').remove();
					tooltip.appendTo(checkGroup);
					valid = false;
				} else {
					checkGroup.find('.tooltip').remove();
				}
			}
			return valid;
		}

	}

	formValidate.doit();
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImJsb2dtZW51LmpzIiwiYmx1ci5qcyIsImZpeGVkLWJsb2ctbWVudS5qcyIsImZsaXAuanMiLCJwYXJhbGF4LmpzIiwicHJlbG9hZGVyLmpzIiwic2hvd21lbnUuanMiLCJzbGlkZXIuanMiLCJ2YWxpZGF0ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIGRvYyA9IGRvY3VtZW50LFxyXG5cdGpEb2MgPSAkKGRvY3VtZW50KTtcclxuXHJcbnZhciBzdmc0ZXZlcnlib2R5ID0gKGZ1bmN0aW9uKCl7XHJcblx0c3ZnNGV2ZXJ5Ym9keSgpO1xyXG59KCkpOyIsIi8vINC90LDQstC40LPQsNGG0LjRjyDQsiDQsdC70L7Qs9C1XHJcblxyXG52YXIgY2hlY2tTZWN0aW9uID0gKGZ1bmN0aW9uICgpe1xyXG5cdC8vIHByaXZhdGVcclxuXHR2YXIgZm9sbG93QmxvZ0xpbmsgPSBmdW5jdGlvbihlZGdlKXtcclxuXHRcdCQoJy5ibG9nX19wb3N0JykuZWFjaChmdW5jdGlvbihpLCBlbCl7XHJcblx0XHRcdFx0dmFyICR0aGlzID0gJCh0aGlzKSxcclxuXHRcdFx0XHR0b3BFZGdlID0gJHRoaXMub2Zmc2V0KCkudG9wIC0gZWRnZSxcclxuXHRcdFx0XHRib3R0b21FZGdlID0gdG9wRWRnZSArICR0aGlzLmhlaWdodCgpLFxyXG5cdFx0XHRcdHdTY3JvbGwgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XHJcblxyXG5cdFx0XHRcdGlmICh0b3BFZGdlIDwgd1Njcm9sbCAmJiBib3R0b21FZGdlID4gd1Njcm9sbCkge1xyXG5cdFx0XHRcdFx0dmFyIGN1cnJlbnRJZCA9ICR0aGlzLmRhdGEoJ3NlY3Rpb24nKSxcclxuXHRcdFx0XHRcdFx0cmVxTGluayA9ICQoJy5ibG9nX19uYXZfX2xpbmsnKS5maWx0ZXIoJ1tocmVmID0gXCIjJyArIGN1cnJlbnRJZCArICdcIl0nKTtcclxuXHJcblx0XHRcdFx0XHRyZXFMaW5rLmNsb3Nlc3QoJy5ibG9nX19uYXZfX2l0ZW0nKS5hZGRDbGFzcygnYWN0aXZlJylcclxuXHRcdFx0XHRcdFx0LnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0fTtcclxuXHJcblx0Ly8gcHVibGljXHJcblx0cmV0dXJuIHtcclxuXHRcdGluaXQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgd1dpZHRoID0gJCh3aW5kb3cpLndpZHRoKCk7XHJcblx0XHRcdGlmICggd1dpZHRoID4gNzY4ICkge1xyXG5cdFx0XHRcdGZvbGxvd0Jsb2dMaW5rKDcwKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRmb2xsb3dCbG9nTGluaygyMDApO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG59KCkpO1xyXG5cclxuJCh3aW5kb3cpLnNjcm9sbChmdW5jdGlvbigpe1xyXG5cdGNoZWNrU2VjdGlvbi5pbml0KCk7XHJcbn0pOyIsInZhciBibHVyID0gZnVuY3Rpb24gKCkge1xyXG5cdHZhciB3cmFwcGVyID0gZG9jLnF1ZXJ5U2VsZWN0b3IoJy5ibHVyX193cmFwcGVyJyksXHJcblx0XHRmb3JtID0gZG9jLnF1ZXJ5U2VsZWN0b3IoJy5ibHVyX19mb3JtJyk7XHJcblxyXG5cdHJldHVybiBmdW5jdGlvbigpIHtcclxuXHRcdFx0aWYgKHdyYXBwZXIsIGZvcm0pIHtcclxuXHRcdFx0XHR2YXIgaW1nV2lkdGggPSBkb2MucXVlcnlTZWxlY3RvcignLmJsdXJfX2JhY2tncm91bmQnKS5vZmZzZXRXaWR0aCxcclxuXHRcdFx0XHRcdHBvc0xlZnQgPSAtd3JhcHBlci5vZmZzZXRMZWZ0LFxyXG5cdFx0XHRcdFx0cG9zVG9wID0gLXdyYXBwZXIub2Zmc2V0VG9wLFxyXG5cdFx0XHRcdFx0Ymx1ckNTUyA9IGZvcm0uc3R5bGU7XHJcblxyXG5cdFx0XHRcdGJsdXJDU1MuYmFja2dyb3VuZFNpemUgPSBpbWdXaWR0aCArICdweCAnICsgJ2F1dG8nO1xyXG5cdFx0XHRcdGJsdXJDU1MuYmFja2dyb3VuZFBvc2l0aW9uID0gcG9zTGVmdCArICdweCAnICsgcG9zVG9wICsgJ3B4JztcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG59O1xyXG5cclxudmFyIG1ha2VCbHVyID0gYmx1cigpO1xyXG5cclxubWFrZUJsdXIoKTtcclxuXHJcbndpbmRvdy5vbnJlc2l6ZSA9IGZ1bmN0aW9uICgpIHtcclxuXHRtYWtlQmx1cigpO1xyXG59OyIsInZhciBmaXhlZEJsb2dNZW51ID0gKGZ1bmN0aW9uICgpIHtcclxuXHQvLyBwcml2YXRlXHJcblx0dmFyIG1vdmVNZW51ID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0dmFyIHdXaWR0aCA9ICQod2luZG93KS53aWR0aCgpO1xyXG5cclxuXHRcdGlmICggd1dpZHRoID4gNzY4ICkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyh3V2lkdGgpO1xyXG5cdFx0XHR2YXIgbWVudVdpZHRoID0gJCgnLmJsb2dfX25hdl9faXRlbXMnKS53aWR0aCgpLFxyXG5cdFx0XHR3U2Nyb2xsID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpLFxyXG5cdFx0XHRvZmZzZXQgPSAkKCcuYmxvZ19fbmF2Jykub2Zmc2V0KCksXHJcblx0XHRcdG1lbnUgPSAkKCcuYmxvZ19fbmF2X19pdGVtcycpO1xyXG5cclxuXHRcdFx0aWYgKCAob2Zmc2V0LnRvcCAtIDcwKSA8IHdTY3JvbGwgKSB7XHJcblx0XHRcdFx0bWVudS5hZGRDbGFzcygnYmxvZ19fbmF2X19pdGVtcy1maXhlZCcpO1xyXG5cdFx0XHRcdG1lbnUuY3NzKHt3aWR0aDogbWVudVdpZHRoLCBsZWZ0OiBvZmZzZXQubGVmdCArIDl9KTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRtZW51LnJlbW92ZUNsYXNzKCdibG9nX19uYXZfX2l0ZW1zLWZpeGVkJyk7XHJcblx0XHRcdFx0bWVudS5yZW1vdmVBdHRyKCdzdHlsZScpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fSAvLyBpZlxyXG5cdH07XHJcblxyXG5cdHZhciBzd2lwZU1lbnUgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHQkKCcuanMtbW9iQnV0dG9uJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSl7XHJcblxyXG5cdFx0XHQkKCcuYmxvZ19fbmF2JykudG9nZ2xlQ2xhc3MoJ2pzLXNob3dNZW51Jyk7XHJcblx0XHRcdCQoJy53cmFwcGVyLWJsb2cnKS50b2dnbGVDbGFzcygnanMtbW92ZUxlZnQnKTtcclxuXHJcblx0XHR9KTtcclxuXHR9O1xyXG5cclxuXHQvLyBwdWJsaWNcclxuXHRyZXR1cm4ge1xyXG5cdFx0Zml4ZWRtZW51OiBmdW5jdGlvbigpIHtcclxuXHRcdFx0aWYgKCAkKCcuYmxvZ19fbmF2JykubGVuZ3RoICkge1xyXG5cdFx0XHRcdFx0bW92ZU1lbnUoKTtcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHJcblx0XHRvcGVuTWVudTogZnVuY3Rpb24oKXtcclxuXHRcdFx0aWYgKCAkKCcuYmxvZ19fbmF2JykubGVuZ3RoICkge1xyXG5cdFx0XHRcdHN3aXBlTWVudSgpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxufSgpKTsgLy8gZW5kIG1haW4gZnVuY3Rpb25cclxuXHJcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xyXG5cdCQod2luZG93KS5zY3JvbGwoZnVuY3Rpb24oZXZlbnQpIHtcclxuXHRcdGZpeGVkQmxvZ01lbnUuZml4ZWRtZW51KCk7XHJcblx0fSk7XHJcblx0JCh3aW5kb3cpLnJlc2l6ZShmdW5jdGlvbihldmVudCkge1xyXG5cdFx0Zml4ZWRCbG9nTWVudS5maXhlZG1lbnUoKTtcclxuXHR9KTtcclxuXHRmaXhlZEJsb2dNZW51Lm9wZW5NZW51KCk7XHJcbn0pO1xyXG5cclxuXHJcbiIsInZhciBmbGlwRWZmZWN0ID0gKGZ1bmN0aW9uKCkge1xyXG5cdHZhciBmbGlwQnRuID0gJCgnLmZsaXAtYnRuJyksXHJcblx0XHRmbGlwUmV0dXJuID0gJCgnLmZsaXAtYnRuLXJldHVybicpLFxyXG5cdFx0Y29udGFpbmVyID0gJCgnLmZsaXBjb250YWluZXInKTtcclxuXHJcblx0cmV0dXJuIHtcclxuXHRcdGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0ZmxpcEJ0bi5vbignY2xpY2snLCBmdW5jdGlvbihlKXtcclxuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0Y29udGFpbmVyLnRvZ2dsZUNsYXNzKCdmbGlwJyk7XHJcblx0XHRcdFx0ZmxpcEJ0bi50b2dnbGVDbGFzcygnaGlkZScpO1xyXG5cdFx0XHRcdCQoJy50b29sdGlwJykucmVtb3ZlKCk7XHJcblx0XHRcdFx0JCgnLmZvcm0nKS5maW5kKCcuZXJyb3InKS5yZW1vdmVDbGFzcyhcImVycm9yXCIpO1xyXG5cdFx0XHRcdCQoJ2Zvcm0nKVswXS5yZXNldCgpO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0ZmxpcFJldHVybi5vbignY2xpY2snLCBmdW5jdGlvbihlKXtcclxuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0Y29udGFpbmVyLnRvZ2dsZUNsYXNzKCdmbGlwJyk7XHJcblx0XHRcdFx0ZmxpcEJ0bi50b2dnbGVDbGFzcygnaGlkZScpO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0Ly8g0L/QtdGA0LXQstC+0YDQsNGH0LjQstCw0LXQvCDRhNC+0YDQvNGDINC/0L4g0LrQu9C40LrRgyDQstC90LUg0YTQvtGA0LzRi1xyXG5cdFx0XHRqRG9jLm1vdXNldXAoZnVuY3Rpb24gKGUpIHtcclxuXHRcdFx0XHRpZiAoY29udGFpbmVyLmhhcyhlLnRhcmdldCkubGVuZ3RoID09PSAwKXtcclxuXHRcdFx0XHRcdGNvbnRhaW5lci5yZW1vdmVDbGFzcygnZmxpcCcpO1xyXG5cdFx0XHRcdFx0ZmxpcEJ0bi5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG5cdFx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxufTtcclxufSgpKTtcclxuXHJcbmZsaXBFZmZlY3QuaW5pdCgpOyIsIi8vINGB0L7Qt9C00LDQtdC8INC/0LDRgNCw0LvQsNC60YFcclxudmFyIHBhcmFsbGF4ID0gKGZ1bmN0aW9uICgpIHtcclxuXHQvLyDQsdC10YDQtdC8INGN0LvQtdC80LXQvdGC0YssINC60L7RgtC+0YDRi9C1INCx0YPQtNC10Lwg0LTQstC40LPQsNGC0YxcclxuXHR2YXJcdGJnID0gZG9jLnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX3BpY3R1cmUnKSwgLy8g0LHQtdGA0LXQvCDQsdC70L7QuiDRgSDQutCw0YDRgtC40L3QutC+0LlcclxuXHRcdHVzZXIgPSBkb2MucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fdXNlcicpLCAvLyDQsdC70L7QuiDRgSDRjtC30LXRgNC+0LxcclxuXHRcdHNlY3Rpb25UZXh0ID0gZG9jLnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX2ljb24nKTsgLy8g0LHQu9C+0Log0YEgUG9ydGZvbGlvXHJcblx0Ly8g0LLQvtC30LLRgNCw0YnQsNC10Lwg0YDQtdC30YPQu9GM0YLQsNGCINGE0YPQvdC60YbQuNC4XHJcblx0cmV0dXJuIHtcclxuXHRcdC8vIG1vdmVcclxuXHRcdG1vdmU6IGZ1bmN0aW9uIChibG9jayx3aW5kb3dTY3JvbGwsc3RyYWZlQW1vdW50KSB7XHJcblx0XHRcdC8vIGJsb2NrIC0g0LrQsNC60L7QuSDQsdC70L7QuiDQtNCy0LjQs9Cw0LXQvFxyXG5cdFx0XHQvLyB3aW5kb3dTY3JvbGwgLSDQvdCwINGB0LrQvtC70YzQutC+INC/0YDQvtC70LjRgdGC0LDQu9C4INGB0YLRgNCw0L3QuNGG0YNcclxuXHRcdFx0Ly8gc3RyYWZlQW1vdW50IC0g0LrQvtGN0YTRhNC10YbQuNC10L3Rgiwg0L3QsCDQutC+0YLQvtGA0YvQuSDQsdGD0LTQtdC8INC00LXQu9C40YLRjCDQtNC70Y8g0YHQutC+0YDQvtGB0YLQuFxyXG5cdFx0XHQvLyDQstGL0YfQuNGB0LvRj9C10Lwg0LfQvdCw0YfQtdC90LjQtSDQtNC70Y8g0LTQstC40LbQtdC90LjRjyDQsiDQv9GA0L7RhtC10L3RgtCw0YVcclxuXHRcdFx0dmFyIHN0cmFmZSA9IHdpbmRvd1Njcm9sbCAvIC1zdHJhZmVBbW91bnQgKyAnJSc7XHJcblx0XHRcdC8vINC/0LXRgNC10LrQu9GO0YfQsNC10Lwg0L3QsNCz0YDRg9C30LrRgyDQvdCwINCy0LjQtNC10L7QutCw0YDRgtGDXHJcblx0XHRcdHZhciB0cmFuc2Zvcm1TdHJpbmcgPSAndHJhbnNsYXRlM2QoMCwnICsgc3RyYWZlICsgJywwKSc7XHJcblx0XHRcdC8vINC00L7QsdCw0LLQu9GP0LXQvCDRgdGC0LjQu9GMINC6INC90LDRiNC10LzRgyDQsdC70L7QutGDXHJcblx0XHRcdHZhciBzdHlsZSA9IGJsb2NrLnN0eWxlO1xyXG5cdFx0XHQvLyDQuNGB0L/QvtC70YzQt9GD0LXQvCB0cmFuc2Zvcm0g0LTQu9GPINGB0LzQtdGJ0LXQvdC40Y9cclxuXHRcdFx0Ly8g0LIg0Y3RgtC+0Lwg0YHQu9GD0YfQsNC1INC/0YDQvtGB0YfQtdGCINC+0YHRg9GJ0LXRgdGC0LLQu9GP0LXRgtGB0Y8g0YLQvtC70YzQutC+INC+0LTQuNC9INGA0LDQtywg0YfRgtC+INGB0L3QuNC20LDQtdGCINC90LDQs9GA0YPQt9C60YNcclxuXHRcdFx0c3R5bGUudHJhbnNmb3JtID0gdHJhbnNmb3JtU3RyaW5nO1xyXG5cdFx0XHRzdHlsZS53ZWJraXRUcmFuc2Zvcm0gPSB0cmFuc2Zvcm1TdHJpbmc7XHJcblx0XHRcdC8vINC/0YDQuNGB0LLQsNC40LLQsNC10Lwg0LfQvdCw0YfQtdC90LjRjiAndG9wJyDQv9C10YDQtdC80LXQvdC90YPRjiBzdHJhZmUgLSDRjdGC0L4g0LHRg9C00LXRgiDQv9GA0L7RhtC10L3RgiDRgdC80LXRidC10L3QuNGPXHJcblx0XHRcdHN0eWxlLnRvcCA9IHN0cmFmZTtcclxuXHRcdH0sXHJcblx0XHQvLyBpbml0XHJcblx0XHRpbml0OiBmdW5jdGlvbih3U2Nyb2xsKSB7XHJcblx0XHRcdC8vINC00LLQuNCz0LDQtdC8ICdiZycg0LIg0LfQsNCy0LjRgdC40LzQvtGB0YLQuCDQvtGCICd3U2Nyb2xsJyDQuCDQt9Cw0LTQsNC10Lwg0LrQvtGN0YTRhNC40YbQuNC10YIgKNGH0LXQvCDQvtC9INCx0L7Qu9GM0YjQtSwg0YLQtdC8INC80LXQtNC70LXQvdC90LXQtSDQtNCy0LjQs9Cw0LXRgtGB0Y8pXHJcblxyXG5cdFx0XHR0aGlzLm1vdmUoYmcsIHdTY3JvbGwsIDYwKTtcclxuXHRcdFx0aWYgKHNlY3Rpb25UZXh0KSB7XHJcblx0XHRcdHRoaXMubW92ZShzZWN0aW9uVGV4dCwgd1Njcm9sbCwgMzApOyB9XHJcblx0XHRcdHRoaXMubW92ZSh1c2VyLCB3U2Nyb2xsLCA1MCk7XHJcblx0XHR9XHJcblx0fVxyXG59KCkpO1xyXG5cclxud2luZG93Lm9uc2Nyb2xsID0gZnVuY3Rpb24oKSB7XHJcblx0Ly8g0YPQt9C90LDQtdC8INC90LAg0YHQutC+0LvRjNC60L4g0L/RgNC+0LrRgNGD0YLQuNC70Lgg0YHRgtGA0LDQvdC40YbRg1xyXG5cdHZhciB3U2Nyb2xsID0gd2luZG93LnBhZ2VZT2Zmc2V0O1xyXG5cclxuXHQvLyDQstGL0LfRi9Cy0LDQtdC8IHBhcmFsbGF4INC/0L4g0YHQutGA0L7Qu9C70YNcclxuXHRwYXJhbGxheC5pbml0KHdTY3JvbGwpO1xyXG59OyIsInZhciBwcmVsb2FkZXIgPSAoZnVuY3Rpb24oKXtcclxuXHJcblx0dmFyIHBlcmNlbnRzVG90YWwgPSAxLFxyXG5cdFx0cHJlbG9hZGVyID0gJCgnLnByZWxvYWRlcicpO1xyXG5cclxuXHR2YXIgaW1nUGF0aCA9ICQoJyonKS5tYXAoZnVuY3Rpb24oaW5kZXgsIGVsZW1lbnQpIHtcclxuXHRcdHZhciBiZ3JvdW5kID0gJChlbGVtZW50KS5jc3MoJ2JhY2tncm91bmQtaW1hZ2UnKSxcclxuXHRcdFx0aW1nID0gJChlbGVtZW50KS5pcygnaW1nJyksXHJcblx0XHRcdHBhdGggPSAnJztcclxuXHJcblx0XHRpZiAoYmdyb3VuZCAhPSAnbm9uZScpIHtcclxuXHRcdFx0cGF0aCA9IGJncm91bmQucmVwbGFjZSgndXJsKFwiJywgJycpLnJlcGxhY2UoJ1wiKScsICcnKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoaW1nKSB7XHJcblx0XHRcdHBhdGggPSAkKGVsZW1lbnQpLmF0dHIoJ3NyYycpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChwYXRoKSByZXR1cm4gcGF0aFxyXG5cdH0pXHJcblxyXG5cdHZhciBzZXRQZXJjZW50cyA9IGZ1bmN0aW9uKHRvdGFsLCBjdXJyZW50KSB7XHJcblx0XHR2YXIgcGVyY2VudHMgPSBNYXRoLmNlaWwoY3VycmVudCAvIHRvdGFsICogMTAwKTtcclxuXHJcblx0XHQkKCcucHJlbG9hZGVyX19wZXJjZW50cycpLnRleHQocGVyY2VudHMpO1xyXG5cclxuXHRcdGlmIChwZXJjZW50cyA+PSAxMDApIHtcclxuXHRcdFx0cHJlbG9hZGVyLmZhZGVPdXQoKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHZhciBsb2FkSW1hZ2VzID0gZnVuY3Rpb24oaW1hZ2VzKSB7XHJcblxyXG5cdFx0aWYoIWltYWdlcy5sZW5ndGgpIHByZWxvYWRlci5mYWRlT3V0KCk7XHJcblxyXG5cdFx0aW1hZ2VzLmZvckVhY2goZnVuY3Rpb24oaW1nLCBpLCBpbWFnZXMpIHtcclxuXHRcdFx0dmFyIGZha2VJbWcgPSAkKCc8aW1nPicsIHtcclxuXHRcdFx0XHRhdHRyIDoge1xyXG5cdFx0XHRcdFx0c3JjOiBpbWdcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0ZmFrZUltZy5vbignbG9hZCBlcnJvcicsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHNldFBlcmNlbnRzKGltYWdlcy5sZW5ndGgsIHBlcmNlbnRzVG90YWwpO1xyXG5cdFx0XHRcdHBlcmNlbnRzVG90YWwrKztcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdHJldHVybiB7XHJcblx0XHRpbml0OiBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdHZhciBpbWdzID0gaW1nUGF0aC50b0FycmF5KCk7XHJcblx0XHRcdGxvYWRJbWFnZXMoaW1ncyk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxufSAoKSApO1xyXG5cclxuJChmdW5jdGlvbiAoKSB7XHJcblx0cHJlbG9hZGVyLmluaXQoKTtcclxufSk7IiwidmFyIHNob3dNZW51ID0oZnVuY3Rpb24oKSB7XHJcblx0dmFyIG1lbnVCdG4gPSAkKCcjdG9nZ2xlbmF2JyksXHJcblx0XHRcdG1lbnUgPSBcdCQoJyNuYXZpZ2F0ZScpLFxyXG5cdFx0XHRtZW51SXRlbSA9ICQoJy5uYXZpZ2F0ZS10b3BfX2xpbmsnKSxcclxuXHRcdFx0aHRtbCA9ICQoJ2h0bWwnKSxcclxuXHRcdFx0YW5pbWF0ZSA9ICQoJy5uYXYtYW5pbWF0ZScpO1xyXG5cclxuXHR2YXIgb3Blbk1lbnUgPSBmdW5jdGlvbigpe1xyXG5cdFx0bWVudUJ0bi5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcblx0XHRcdG1lbnUudG9nZ2xlKDAsIGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0bWVudS50b2dnbGVDbGFzcygnbmF2aWdhdGUtc2hvdycpO1xyXG5cdFx0XHRcdG1lbnVCdG4udG9nZ2xlQ2xhc3MoJ2hhbWJ1cmdlcl9faWNvbi1jbG9zZScpO1xyXG5cdFx0XHRcdGh0bWwudG9nZ2xlQ2xhc3MoJ2hpZGVTY3JvbGwnKTtcclxuXHRcdFx0XHQkKCcubmF2aWdhdGUtdG9wJykuYWRkQ2xhc3MoJ25hdmlnYXRlLXRvcC1hbmltYXRlJyk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fTtcclxuXHJcblx0cmV0dXJuIHtcclxuXHRcdGluaXQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRvcGVuTWVudSgpO1xyXG5cdFx0fVxyXG5cdH1cclxufSAoKSApO1xyXG5cclxuc2hvd01lbnUuaW5pdCgpOyIsInZhciBzbGlkZXIgPSAoZnVuY3Rpb24oKXtcclxuXHRyZXR1cm4ge1xyXG5cdFx0aW5pdDogZnVuY3Rpb24oKXtcclxuXHJcblx0XHRcdHZhciBfdGhpcyA9IHRoaXM7XHJcblxyXG5cdFx0XHQvLyDQtNC+0LHQsNCy0LvRj9C10Lwg0YLQvtGH0LrQuFxyXG5cdFx0XHRfdGhpcy5tYWtlRG90cygpO1xyXG5cclxuXHRcdFx0Ly8g0LbQvNC10Lwg0LrQvdC+0L/QutC4XHJcblx0XHRcdCQoJy5zbGlkZXJfX2J0bicpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpe1xyXG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcblx0XHRcdFx0dmFyICR0aGlzID0gJCh0aGlzKSxcclxuXHRcdFx0XHRpdGVtcyA9ICR0aGlzLmNsb3Nlc3QoJy5zbGlkZXJfX2NvbnRhaW5lcicpLmZpbmQoJy5zbGlkZXJfX2l0ZW0nKSxcclxuXHRcdFx0XHRhY3RpdmVJdGVtID0gaXRlbXMuZmlsdGVyKCcuYWN0aXZlJyksXHJcblx0XHRcdFx0bmV4dEl0ZW0gPSBhY3RpdmVJdGVtLm5leHQoKSxcclxuXHRcdFx0XHRwcmV2SXRlbSA9IGFjdGl2ZUl0ZW0ucHJldigpLFxyXG5cdFx0XHRcdGZpcnN0SXRlbSA9IGl0ZW1zLmZpcnN0KCksXHJcblx0XHRcdFx0bGFzdFNsaWRlID0gaXRlbXMubGFzdDtcclxuXHJcblx0XHRcdFx0aWYoICR0aGlzLmhhc0NsYXNzKCdzbGlkZXJfX2J0bi1uZXh0JykgKXtcclxuXHJcblx0XHRcdFx0XHRpZiAobmV4dEl0ZW0ubGVuZ3RoKSB7XHJcblx0XHRcdFx0XHRcdF90aGlzLm1vdmVTbGlkZShuZXh0SXRlbSk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRfdGhpcy5tb3ZlU2xpZGUoZmlyc3RJdGVtKTtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGlmIChwcmV2SXRlbS5sZW5ndGgpIHtcclxuXHRcdFx0XHRcdFx0X3RoaXMubW92ZVNsaWRlKHByZXZJdGVtKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdF90aGlzLm1vdmVTbGlkZShsYXN0SXRlbSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH0sXHJcblxyXG5cdFx0Ly8g0LTQstC40LPQsNC10Lwg0YHQu9Cw0LnQtNGLXHJcblx0XHRtb3ZlU2xpZGU6IGZ1bmN0aW9uKHNsaWRlKSB7XHJcblxyXG5cdFx0XHRcdHZhciBfdGhpcyA9IHRoaXMsXHJcblx0XHRcdFx0XHRjb250YWluZXIgPSBzbGlkZS5jbG9zZXN0KCcuc2xpZGVyX19jb250YWluZXInKSxcclxuXHRcdFx0XHRcdGl0ZW1zID0gY29udGFpbmVyLmZpbmQoJy5zbGlkZXJfX2l0ZW0nKSxcclxuXHRcdFx0XHRcdGFjdGl2ZSA9IGl0ZW1zLmZpbHRlcignLmFjdGl2ZScpO1xyXG5cclxuXHRcdFx0XHRpdGVtcy5hZGRDbGFzcygnaGlkZVNsaWRlJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZSBzaG93U2xpZGUnKTtcclxuXHRcdFx0XHRzbGlkZS5yZW1vdmVDbGFzcygnaGlkZVNsaWRlJykuYWRkQ2xhc3MoJ2FjdGl2ZSBzaG93U2xpZGUnKTtcclxuXHJcblx0XHRcdFx0X3RoaXMuYWN0aXZlRG90KGNvbnRhaW5lci5maW5kKCcuc2xpZGVyX19kb3RzX19pdGVtcycpKTtcclxuXHRcdH0sIC8vIG1vdmVTbGlkZVxyXG5cclxuXHRcdG1ha2VEb3RzOiBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdHZhciBfdGhpcyA9IHRoaXMsXHJcblx0XHRcdFx0Y29udGFpbmVyID0gJCgnLnNsaWRlcl9fY29udGFpbmVyJyksXHJcblx0XHRcdFx0ZG90SHRtbCA9ICc8bGkgY2xhc3M9XCJzbGlkZXJfX2RvdHNfX2l0ZW1cIj48YnV0dG9uIGNsYXNzPVwic2xpZGVyX19kb3RzX19idG5cIj48L2J1dHRvbj48L2xpPic7XHJcblxyXG5cdFx0XHRjb250YWluZXIuZWFjaChmdW5jdGlvbigpe1xyXG5cdFx0XHRcdHZhciAkdGhpcyA9ICQodGhpcyksXHJcblx0XHRcdFx0aXRlbXMgPSAkdGhpcy5maW5kKCcuc2xpZGVyX19pdGVtJyksXHJcblx0XHRcdFx0ZG90Q29udGFpbmVyID0gJHRoaXMuZmluZCgnLnNsaWRlcl9fZG90c19faXRlbXMnKTtcclxuXHJcblx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBpdGVtcy5zaXplKCk7IGkrKykge1xyXG5cdFx0XHRcdFx0ZG90Q29udGFpbmVyLmFwcGVuZChkb3RIdG1sKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdF90aGlzLmFjdGl2ZURvdChkb3RDb250YWluZXIpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0sIC8vIG1ha2VEb3RzXHJcblxyXG5cdFx0YWN0aXZlRG90OiBmdW5jdGlvbihjb250YWluZXIpIHtcclxuXHRcdFx0dmFyIGl0ZW1zID0gY29udGFpbmVyLmNsb3Nlc3QoJy5zbGlkZXJfX2NvbnRhaW5lcicpLmZpbmQoJy5zbGlkZXJfX2l0ZW0nKTtcclxuXHJcblx0XHRcdGNvbnRhaW5lclxyXG5cdFx0XHRcdC5maW5kKCcuc2xpZGVyX19kb3RzX19pdGVtJylcclxuXHRcdFx0XHQuZXEoaXRlbXMuZmlsdGVyKCcuYWN0aXZlJykuaW5kZXgoKSlcclxuXHRcdFx0XHQuYWRkQ2xhc3MoJ2FjdGl2ZScpXHJcblx0XHRcdFx0LnNpYmxpbmdzKClcclxuXHRcdFx0XHQucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cdFx0fSAvLyBhY3RpdmVEb3RcclxuXHR9IC8vIHJldHVyblxyXG59KCkpO1xyXG5cclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oJCkge1xyXG5cdGlmICgkKCcuc2xpZGVyX19jb250YWluZXInKSkge1xyXG5cdFx0c2xpZGVyLmluaXQoKTtcclxuXHR9XHJcbn0pOyIsIihmdW5jdGlvbigpe1xyXG5cdHZhciBmb3JtVmFsaWRhdGUgPSB7XHJcblx0XHRkb2l0OiBmdW5jdGlvbigpe1xyXG5cdFx0XHR0aGlzLmxpc3RlbmVycygpO1xyXG5cdFx0fSxcclxuXHJcblx0XHRsaXN0ZW5lcnM6IGZ1bmN0aW9uKCl7XHJcblx0XHRcdCQoJyNtYWlsRm9ybScpLm9uKCdzdWJtaXQnLCBmb3JtVmFsaWRhdGUubWFpbG1lKTtcclxuXHRcdFx0JCgnI2xvZ2luRm9ybScpLm9uKCdzdWJtaXQnLCBmb3JtVmFsaWRhdGUubG9naW5WYWxpZCk7XHJcblx0XHR9LFxyXG5cclxuXHRcdGxvZ2luVmFsaWQ6IGZ1bmN0aW9uKGUpe1xyXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdHZhciBmb3JtID0gJCh0aGlzKTtcclxuXHRcdFx0aWYgKCBmb3JtVmFsaWRhdGUudmFsaWQoZm9ybSkgPT09IGZhbHNlICkgcmV0dXJuIGZhbHNlO1xyXG5cclxuXHRcdFx0Y29uc29sZS5sb2coJ2NvbWUgaW4nKTtcclxuXHRcdH0sXHJcblxyXG5cdFx0bWFpbG1lOiBmdW5jdGlvbihlKXtcclxuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHR2YXIgZm9ybSA9ICQodGhpcyk7XHJcblx0XHRcdGlmICggZm9ybVZhbGlkYXRlLnZhbGlkKGZvcm0pID09PSBmYWxzZSApIHJldHVybiBmYWxzZTtcclxuXHJcblx0XHRcdHZhciBmb3JtZGF0YSA9IGZvcm0uc2VyaWFsaXplKCk7XHJcblxyXG5cdFx0XHRjb25zb2xlLmxvZyhmb3JtZGF0YSk7XHJcblx0XHRcdCQuYWpheCh7XHJcblx0XHRcdFx0dXJsOiAnYXNzZXRzL3BocC9tYWlsLXByb2Nlc3MucGhwJyxcclxuXHRcdFx0XHR0eXBlOiAnUE9TVCcsXHJcblx0XHRcdFx0ZGF0YTogZm9ybWRhdGFcclxuXHRcdFx0fSlcclxuXHRcdFx0LmRvbmUoZnVuY3Rpb24obXNnKSB7XHJcblx0XHRcdFx0aWYgKG1zZyA9PT0gJ09LJykge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ09LJyk7XHJcblx0XHRcdFx0XHRmb3JtLnRyaWdnZXIoXCJyZXNldFwiKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0JCgnaW5wdXQjbWFpbE1haWwnKS5wYXJlbnRzKCcuZm9ybV9fdGV4dCcpLmFkZENsYXNzKCdlcnJvcicpO1xyXG5cdFx0XHRcdFx0JCgnPHNwYW4gY2xhc3M9XCJ0b29sdGlwXCI+JyArIG1zZyArICc8L3NwYW4+JykuYXBwZW5kVG8oJy5lcnJvcicpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSlcclxuXHRcdFx0LmZhaWwoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coXCJlcnJvclwiKTtcclxuXHRcdFx0fSlcclxuXHRcdFx0LmFsd2F5cyhmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhcImNvbXBsZXRlXCIpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHR9LFxyXG5cclxuXHRcdHZhbGlkOiBmdW5jdGlvbihmb3JtKXtcclxuXHRcdFx0dmFyIGlucHV0cyA9IGZvcm0uZmluZCgnaW5wdXQsIHRleHRhcmVhJyksXHJcblx0XHRcdFx0Y2hlY2tzID0gZm9ybS5maW5kKCdpbnB1dDpjaGVja2JveCwgaW5wdXQ6cmFkaW8nKSxcclxuXHRcdFx0XHRjaGVja3NPayA9IGZvcm0uZmluZCgnaW5wdXQ6Y2hlY2tlZCcpLFxyXG5cdFx0XHRcdHZhbGlkID0gdHJ1ZTtcclxuXHJcblx0XHRcdCQuZWFjaChpbnB1dHMsIGZ1bmN0aW9uKGluZGV4LCB2YWwpIHtcclxuXHRcdFx0XHR2YXIgaW5wdXQgPSAkKHZhbCksXHJcblx0XHRcdFx0dmFsID0gaW5wdXQudmFsKCksXHJcblx0XHRcdFx0Zm9ybUdyb3VwID0gaW5wdXQucGFyZW50cygnLmZvcm1fX3RleHQsIC5mb3JtX190ZXh0X2ljb24nKSxcclxuXHRcdFx0XHRsYWJlbCA9IGZvcm1Hcm91cC5maW5kKCdsYWJlbCcpLnRleHQoKS50b0xvd2VyQ2FzZSgpLFxyXG5cdFx0XHRcdHRleHRFcnJvciA9ICfQktGLINC90LUg0LLQstC10LvQuCAnICsgbGFiZWwsXHJcblx0XHRcdFx0dG9vbHRpcCA9ICQoJzxzcGFuIGNsYXNzPVwidG9vbHRpcFwiPicgKyB0ZXh0RXJyb3IgKyAnPC9zcGFuPicpO1xyXG5cclxuXHRcdFx0XHRpZiAodmFsLmxlbmd0aCA9PT0gMCl7XHJcblx0XHRcdFx0XHRmb3JtR3JvdXAuYWRkQ2xhc3MoJ2Vycm9yJyk7XHJcblx0XHRcdFx0XHRmb3JtR3JvdXAuZmluZCgnLnRvb2x0aXAnKS5yZW1vdmUoKTtcclxuXHRcdFx0XHRcdHRvb2x0aXAuYXBwZW5kVG8oZm9ybUdyb3VwKTtcclxuXHRcdFx0XHRcdGlucHV0Lm9uKCdmb2N1cycsIGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0XHRcdGZvcm1Hcm91cC5maW5kKCcudG9vbHRpcCcpLnJlbW92ZSgpO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRpbnB1dC5vbigna2V5ZG93bicsIGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0XHRcdGZvcm1Hcm91cC5yZW1vdmVDbGFzcygnZXJyb3InKTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0dmFsaWQgPSBmYWxzZTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Zm9ybUdyb3VwLnJlbW92ZUNsYXNzKCdlcnJvcicpO1xyXG5cdFx0XHRcdFx0Zm9ybUdyb3VwLmZpbmQoJy50b29sdGlwJykucmVtb3ZlKCk7XHJcblx0XHRcdFx0fTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHR2YXIgY2hlY2tHcm91cCA9ICQoJy5mb3JtX19jaGVja3MnKSxcclxuXHRcdFx0XHR0b29sdGlwID0gJCgnPHNwYW4gY2xhc3M9XCJ0b29sdGlwXCI+0KDQvtCx0L7RgtCw0Lwg0YLRg9GCINC90LUg0LzQtdGB0YLQvjwvc3Bhbj4nKTtcclxuXHJcblx0XHRcdGlmIChjaGVja3MubGVuZ3RoID4gMCkge1xyXG5cclxuXHRcdFx0XHRpZiAoY2hlY2tzT2subGVuZ3RoIDwgMikge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ2NoZWNrIHNvbWVvbmUnKTtcclxuXHRcdFx0XHRcdGNoZWNrR3JvdXAuZmluZCgnLnRvb2x0aXAnKS5yZW1vdmUoKTtcclxuXHRcdFx0XHRcdHRvb2x0aXAuYXBwZW5kVG8oY2hlY2tHcm91cCk7XHJcblx0XHRcdFx0XHR2YWxpZCA9IGZhbHNlO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRjaGVja0dyb3VwLmZpbmQoJy50b29sdGlwJykucmVtb3ZlKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiB2YWxpZDtcclxuXHRcdH1cclxuXHJcblx0fVxyXG5cclxuXHRmb3JtVmFsaWRhdGUuZG9pdCgpO1xyXG59KCkpOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
