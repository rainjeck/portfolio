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

			var from,email,message;
			var pattern = /^[a-z0-9_-]+@[a-z0-9-]+\.([a-z]{1,6}\.)?[a-z]{2,6}$/i;
			from=$("#mailName").val();
			email=$("#mailMail").val();
			message=$("#mailMessage").val();
			if(email != ''){
				if(email.search(pattern) == 0){
					$("#mailMessage").text("Sending E-mail...Please wait");
					$.get("./send",{from:from,email:email,message:message},function(data){
						if(data=="sent") {
							$("#mailForm").html("<div>Email is been sent at "+from+" . Please check inbox !</div>");
						}
					});
				} else {
					$('input#mailMail').parents('.form__text').addClass('error');
					$('<span class="tooltip">Некорректрый email</span>').appendTo('.error');
				}
			}
			//var formdata = form.serialize();
			// $.ajax({
			// 	url: 'assets/php/mail-process.php',
			// 	type: 'POST',
			// 	data: formdata
			// })
			// .done(function(msg) {
			// 	if (msg === 'OK') {
			// 		console.log('OK');
			// 		form.trigger("reset");
			// 	} else {
			// 		$('input#mailMail').parents('.form__text').addClass('error');
			// 		$('<span class="tooltip">' + msg + '</span>').appendTo('.error');
			// 	}
			// })
			// .fail(function() {
			// 	console.log("error");
			// })
			// .always(function() {
			// 	console.log("complete");
			// });

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImJsb2dtZW51LmpzIiwiYmx1ci5qcyIsImZpeGVkLWJsb2ctbWVudS5qcyIsImZsaXAuanMiLCJwYXJhbGF4LmpzIiwicHJlbG9hZGVyLmpzIiwic2hvd21lbnUuanMiLCJzbGlkZXIuanMiLCJ2YWxpZGF0ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgZG9jID0gZG9jdW1lbnQsXHJcblx0akRvYyA9ICQoZG9jdW1lbnQpO1xyXG5cclxudmFyIHN2ZzRldmVyeWJvZHkgPSAoZnVuY3Rpb24oKXtcclxuXHRzdmc0ZXZlcnlib2R5KCk7XHJcbn0oKSk7IiwiLy8g0L3QsNCy0LjQs9Cw0YbQuNGPINCyINCx0LvQvtCz0LVcclxuXHJcbnZhciBjaGVja1NlY3Rpb24gPSAoZnVuY3Rpb24gKCl7XHJcblx0Ly8gcHJpdmF0ZVxyXG5cdHZhciBmb2xsb3dCbG9nTGluayA9IGZ1bmN0aW9uKGVkZ2Upe1xyXG5cdFx0JCgnLmJsb2dfX3Bvc3QnKS5lYWNoKGZ1bmN0aW9uKGksIGVsKXtcclxuXHRcdFx0XHR2YXIgJHRoaXMgPSAkKHRoaXMpLFxyXG5cdFx0XHRcdHRvcEVkZ2UgPSAkdGhpcy5vZmZzZXQoKS50b3AgLSBlZGdlLFxyXG5cdFx0XHRcdGJvdHRvbUVkZ2UgPSB0b3BFZGdlICsgJHRoaXMuaGVpZ2h0KCksXHJcblx0XHRcdFx0d1Njcm9sbCA9ICQod2luZG93KS5zY3JvbGxUb3AoKTtcclxuXHJcblx0XHRcdFx0aWYgKHRvcEVkZ2UgPCB3U2Nyb2xsICYmIGJvdHRvbUVkZ2UgPiB3U2Nyb2xsKSB7XHJcblx0XHRcdFx0XHR2YXIgY3VycmVudElkID0gJHRoaXMuZGF0YSgnc2VjdGlvbicpLFxyXG5cdFx0XHRcdFx0XHRyZXFMaW5rID0gJCgnLmJsb2dfX25hdl9fbGluaycpLmZpbHRlcignW2hyZWYgPSBcIiMnICsgY3VycmVudElkICsgJ1wiXScpO1xyXG5cclxuXHRcdFx0XHRcdHJlcUxpbmsuY2xvc2VzdCgnLmJsb2dfX25hdl9faXRlbScpLmFkZENsYXNzKCdhY3RpdmUnKVxyXG5cdFx0XHRcdFx0XHQuc2libGluZ3MoKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHR9O1xyXG5cclxuXHQvLyBwdWJsaWNcclxuXHRyZXR1cm4ge1xyXG5cdFx0aW5pdDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciB3V2lkdGggPSAkKHdpbmRvdykud2lkdGgoKTtcclxuXHRcdFx0aWYgKCB3V2lkdGggPiA3NjggKSB7XHJcblx0XHRcdFx0Zm9sbG93QmxvZ0xpbmsoNzApO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGZvbGxvd0Jsb2dMaW5rKDIwMCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcbn0oKSk7XHJcblxyXG4kKHdpbmRvdykuc2Nyb2xsKGZ1bmN0aW9uKCl7XHJcblx0Y2hlY2tTZWN0aW9uLmluaXQoKTtcclxufSk7IiwidmFyIGJsdXIgPSBmdW5jdGlvbiAoKSB7XHJcblx0dmFyIHdyYXBwZXIgPSBkb2MucXVlcnlTZWxlY3RvcignLmJsdXJfX3dyYXBwZXInKSxcclxuXHRcdGZvcm0gPSBkb2MucXVlcnlTZWxlY3RvcignLmJsdXJfX2Zvcm0nKTtcclxuXHJcblx0cmV0dXJuIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRpZiAod3JhcHBlciwgZm9ybSkge1xyXG5cdFx0XHRcdHZhciBpbWdXaWR0aCA9IGRvYy5xdWVyeVNlbGVjdG9yKCcuYmx1cl9fYmFja2dyb3VuZCcpLm9mZnNldFdpZHRoLFxyXG5cdFx0XHRcdFx0cG9zTGVmdCA9IC13cmFwcGVyLm9mZnNldExlZnQsXHJcblx0XHRcdFx0XHRwb3NUb3AgPSAtd3JhcHBlci5vZmZzZXRUb3AsXHJcblx0XHRcdFx0XHRibHVyQ1NTID0gZm9ybS5zdHlsZTtcclxuXHJcblx0XHRcdFx0Ymx1ckNTUy5iYWNrZ3JvdW5kU2l6ZSA9IGltZ1dpZHRoICsgJ3B4ICcgKyAnYXV0byc7XHJcblx0XHRcdFx0Ymx1ckNTUy5iYWNrZ3JvdW5kUG9zaXRpb24gPSBwb3NMZWZ0ICsgJ3B4ICcgKyBwb3NUb3AgKyAncHgnO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcbn07XHJcblxyXG52YXIgbWFrZUJsdXIgPSBibHVyKCk7XHJcblxyXG5tYWtlQmx1cigpO1xyXG5cclxud2luZG93Lm9ucmVzaXplID0gZnVuY3Rpb24gKCkge1xyXG5cdG1ha2VCbHVyKCk7XHJcbn07IiwidmFyIGZpeGVkQmxvZ01lbnUgPSAoZnVuY3Rpb24gKCkge1xyXG5cdC8vIHByaXZhdGVcclxuXHR2YXIgbW92ZU1lbnUgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHR2YXIgd1dpZHRoID0gJCh3aW5kb3cpLndpZHRoKCk7XHJcblxyXG5cdFx0aWYgKCB3V2lkdGggPiA3NjggKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKHdXaWR0aCk7XHJcblx0XHRcdHZhciBtZW51V2lkdGggPSAkKCcuYmxvZ19fbmF2X19pdGVtcycpLndpZHRoKCksXHJcblx0XHRcdHdTY3JvbGwgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCksXHJcblx0XHRcdG9mZnNldCA9ICQoJy5ibG9nX19uYXYnKS5vZmZzZXQoKSxcclxuXHRcdFx0bWVudSA9ICQoJy5ibG9nX19uYXZfX2l0ZW1zJyk7XHJcblxyXG5cdFx0XHRpZiAoIChvZmZzZXQudG9wIC0gNzApIDwgd1Njcm9sbCApIHtcclxuXHRcdFx0XHRtZW51LmFkZENsYXNzKCdibG9nX19uYXZfX2l0ZW1zLWZpeGVkJyk7XHJcblx0XHRcdFx0bWVudS5jc3Moe3dpZHRoOiBtZW51V2lkdGgsIGxlZnQ6IG9mZnNldC5sZWZ0ICsgOX0pO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdG1lbnUucmVtb3ZlQ2xhc3MoJ2Jsb2dfX25hdl9faXRlbXMtZml4ZWQnKTtcclxuXHRcdFx0XHRtZW51LnJlbW92ZUF0dHIoJ3N0eWxlJyk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9IC8vIGlmXHJcblx0fTtcclxuXHJcblx0dmFyIHN3aXBlTWVudSA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdCQoJy5qcy1tb2JCdXR0b24nKS5vbignY2xpY2snLCBmdW5jdGlvbihlKXtcclxuXHJcblx0XHRcdCQoJy5ibG9nX19uYXYnKS50b2dnbGVDbGFzcygnanMtc2hvd01lbnUnKTtcclxuXHRcdFx0JCgnLndyYXBwZXItYmxvZycpLnRvZ2dsZUNsYXNzKCdqcy1tb3ZlTGVmdCcpO1xyXG5cclxuXHRcdH0pO1xyXG5cdH07XHJcblxyXG5cdC8vIHB1YmxpY1xyXG5cdHJldHVybiB7XHJcblx0XHRmaXhlZG1lbnU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRpZiAoICQoJy5ibG9nX19uYXYnKS5sZW5ndGggKSB7XHJcblx0XHRcdFx0XHRtb3ZlTWVudSgpO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cclxuXHRcdG9wZW5NZW51OiBmdW5jdGlvbigpe1xyXG5cdFx0XHRpZiAoICQoJy5ibG9nX19uYXYnKS5sZW5ndGggKSB7XHJcblx0XHRcdFx0c3dpcGVNZW51KCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG59KCkpOyAvLyBlbmQgbWFpbiBmdW5jdGlvblxyXG5cclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XHJcblx0JCh3aW5kb3cpLnNjcm9sbChmdW5jdGlvbihldmVudCkge1xyXG5cdFx0Zml4ZWRCbG9nTWVudS5maXhlZG1lbnUoKTtcclxuXHR9KTtcclxuXHQkKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uKGV2ZW50KSB7XHJcblx0XHRmaXhlZEJsb2dNZW51LmZpeGVkbWVudSgpO1xyXG5cdH0pO1xyXG5cdGZpeGVkQmxvZ01lbnUub3Blbk1lbnUoKTtcclxufSk7XHJcblxyXG5cclxuIiwidmFyIGZsaXBFZmZlY3QgPSAoZnVuY3Rpb24oKSB7XHJcblx0dmFyIGZsaXBCdG4gPSAkKCcuZmxpcC1idG4nKSxcclxuXHRcdGZsaXBSZXR1cm4gPSAkKCcuZmxpcC1idG4tcmV0dXJuJyksXHJcblx0XHRjb250YWluZXIgPSAkKCcuZmxpcGNvbnRhaW5lcicpO1xyXG5cclxuXHRyZXR1cm4ge1xyXG5cdFx0aW5pdDogZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRmbGlwQnRuLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpe1xyXG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHRjb250YWluZXIudG9nZ2xlQ2xhc3MoJ2ZsaXAnKTtcclxuXHRcdFx0XHRmbGlwQnRuLnRvZ2dsZUNsYXNzKCdoaWRlJyk7XHJcblx0XHRcdFx0JCgnLnRvb2x0aXAnKS5yZW1vdmUoKTtcclxuXHRcdFx0XHQkKCcuZm9ybScpLmZpbmQoJy5lcnJvcicpLnJlbW92ZUNsYXNzKFwiZXJyb3JcIik7XHJcblx0XHRcdFx0JCgnZm9ybScpWzBdLnJlc2V0KCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRmbGlwUmV0dXJuLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpe1xyXG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHRjb250YWluZXIudG9nZ2xlQ2xhc3MoJ2ZsaXAnKTtcclxuXHRcdFx0XHRmbGlwQnRuLnRvZ2dsZUNsYXNzKCdoaWRlJyk7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHQvLyDQv9C10YDQtdCy0L7RgNCw0YfQuNCy0LDQtdC8INGE0L7RgNC80YMg0L/QviDQutC70LjQutGDINCy0L3QtSDRhNC+0YDQvNGLXHJcblx0XHRcdGpEb2MubW91c2V1cChmdW5jdGlvbiAoZSkge1xyXG5cdFx0XHRcdGlmIChjb250YWluZXIuaGFzKGUudGFyZ2V0KS5sZW5ndGggPT09IDApe1xyXG5cdFx0XHRcdFx0Y29udGFpbmVyLnJlbW92ZUNsYXNzKCdmbGlwJyk7XHJcblx0XHRcdFx0XHRmbGlwQnRuLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG59O1xyXG59KCkpO1xyXG5cclxuZmxpcEVmZmVjdC5pbml0KCk7IiwiLy8g0YHQvtC30LTQsNC10Lwg0L/QsNGA0LDQu9Cw0LrRgVxyXG52YXIgcGFyYWxsYXggPSAoZnVuY3Rpb24gKCkge1xyXG5cdC8vINCx0LXRgNC10Lwg0Y3Qu9C10LzQtdC90YLRiywg0LrQvtGC0L7RgNGL0LUg0LHRg9C00LXQvCDQtNCy0LjQs9Cw0YLRjFxyXG5cdHZhclx0YmcgPSBkb2MucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fcGljdHVyZScpLCAvLyDQsdC10YDQtdC8INCx0LvQvtC6INGBINC60LDRgNGC0LjQvdC60L7QuVxyXG5cdFx0dXNlciA9IGRvYy5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX191c2VyJyksIC8vINCx0LvQvtC6INGBINGO0LfQtdGA0L7QvFxyXG5cdFx0c2VjdGlvblRleHQgPSBkb2MucXVlcnlTZWxlY3RvcignLmhlYWRlcl9faWNvbicpOyAvLyDQsdC70L7QuiDRgSBQb3J0Zm9saW9cclxuXHQvLyDQstC+0LfQstGA0LDRidCw0LXQvCDRgNC10LfRg9C70YzRgtCw0YIg0YTRg9C90LrRhtC40LhcclxuXHRyZXR1cm4ge1xyXG5cdFx0Ly8gbW92ZVxyXG5cdFx0bW92ZTogZnVuY3Rpb24gKGJsb2NrLHdpbmRvd1Njcm9sbCxzdHJhZmVBbW91bnQpIHtcclxuXHRcdFx0Ly8gYmxvY2sgLSDQutCw0LrQvtC5INCx0LvQvtC6INC00LLQuNCz0LDQtdC8XHJcblx0XHRcdC8vIHdpbmRvd1Njcm9sbCAtINC90LAg0YHQutC+0LvRjNC60L4g0L/RgNC+0LvQuNGB0YLQsNC70Lgg0YHRgtGA0LDQvdC40YbRg1xyXG5cdFx0XHQvLyBzdHJhZmVBbW91bnQgLSDQutC+0Y3RhNGE0LXRhtC40LXQvdGCLCDQvdCwINC60L7RgtC+0YDRi9C5INCx0YPQtNC10Lwg0LTQtdC70LjRgtGMINC00LvRjyDRgdC60L7RgNC+0YHRgtC4XHJcblx0XHRcdC8vINCy0YvRh9C40YHQu9GP0LXQvCDQt9C90LDRh9C10L3QuNC1INC00LvRjyDQtNCy0LjQttC10L3QuNGPINCyINC/0YDQvtGG0LXQvdGC0LDRhVxyXG5cdFx0XHR2YXIgc3RyYWZlID0gd2luZG93U2Nyb2xsIC8gLXN0cmFmZUFtb3VudCArICclJztcclxuXHRcdFx0Ly8g0L/QtdGA0LXQutC70Y7Rh9Cw0LXQvCDQvdCw0LPRgNGD0LfQutGDINC90LAg0LLQuNC00LXQvtC60LDRgNGC0YNcclxuXHRcdFx0dmFyIHRyYW5zZm9ybVN0cmluZyA9ICd0cmFuc2xhdGUzZCgwLCcgKyBzdHJhZmUgKyAnLDApJztcclxuXHRcdFx0Ly8g0LTQvtCx0LDQstC70Y/QtdC8INGB0YLQuNC70Ywg0Log0L3QsNGI0LXQvNGDINCx0LvQvtC60YNcclxuXHRcdFx0dmFyIHN0eWxlID0gYmxvY2suc3R5bGU7XHJcblx0XHRcdC8vINC40YHQv9C+0LvRjNC30YPQtdC8IHRyYW5zZm9ybSDQtNC70Y8g0YHQvNC10YnQtdC90LjRj1xyXG5cdFx0XHQvLyDQsiDRjdGC0L7QvCDRgdC70YPRh9Cw0LUg0L/RgNC+0YHRh9C10YIg0L7RgdGD0YnQtdGB0YLQstC70Y/QtdGC0YHRjyDRgtC+0LvRjNC60L4g0L7QtNC40L0g0YDQsNC3LCDRh9GC0L4g0YHQvdC40LbQsNC10YIg0L3QsNCz0YDRg9C30LrRg1xyXG5cdFx0XHRzdHlsZS50cmFuc2Zvcm0gPSB0cmFuc2Zvcm1TdHJpbmc7XHJcblx0XHRcdHN0eWxlLndlYmtpdFRyYW5zZm9ybSA9IHRyYW5zZm9ybVN0cmluZztcclxuXHRcdFx0Ly8g0L/RgNC40YHQstCw0LjQstCw0LXQvCDQt9C90LDRh9C10L3QuNGOICd0b3AnINC/0LXRgNC10LzQtdC90L3Rg9GOIHN0cmFmZSAtINGN0YLQviDQsdGD0LTQtdGCINC/0YDQvtGG0LXQvdGCINGB0LzQtdGJ0LXQvdC40Y9cclxuXHRcdFx0c3R5bGUudG9wID0gc3RyYWZlO1xyXG5cdFx0fSxcclxuXHRcdC8vIGluaXRcclxuXHRcdGluaXQ6IGZ1bmN0aW9uKHdTY3JvbGwpIHtcclxuXHRcdFx0Ly8g0LTQstC40LPQsNC10LwgJ2JnJyDQsiDQt9Cw0LLQuNGB0LjQvNC+0YHRgtC4INC+0YIgJ3dTY3JvbGwnINC4INC30LDQtNCw0LXQvCDQutC+0Y3RhNGE0LjRhtC40LXRgiAo0YfQtdC8INC+0L0g0LHQvtC70YzRiNC1LCDRgtC10Lwg0LzQtdC00LvQtdC90L3QtdC1INC00LLQuNCz0LDQtdGC0YHRjylcclxuXHJcblx0XHRcdHRoaXMubW92ZShiZywgd1Njcm9sbCwgNjApO1xyXG5cdFx0XHRpZiAoc2VjdGlvblRleHQpIHtcclxuXHRcdFx0dGhpcy5tb3ZlKHNlY3Rpb25UZXh0LCB3U2Nyb2xsLCAzMCk7IH1cclxuXHRcdFx0dGhpcy5tb3ZlKHVzZXIsIHdTY3JvbGwsIDUwKTtcclxuXHRcdH1cclxuXHR9XHJcbn0oKSk7XHJcblxyXG53aW5kb3cub25zY3JvbGwgPSBmdW5jdGlvbigpIHtcclxuXHQvLyDRg9C30L3QsNC10Lwg0L3QsCDRgdC60L7Qu9GM0LrQviDQv9GA0L7QutGA0YPRgtC40LvQuCDRgdGC0YDQsNC90LjRhtGDXHJcblx0dmFyIHdTY3JvbGwgPSB3aW5kb3cucGFnZVlPZmZzZXQ7XHJcblxyXG5cdC8vINCy0YvQt9GL0LLQsNC10LwgcGFyYWxsYXgg0L/QviDRgdC60YDQvtC70LvRg1xyXG5cdHBhcmFsbGF4LmluaXQod1Njcm9sbCk7XHJcbn07IiwidmFyIHByZWxvYWRlciA9IChmdW5jdGlvbigpe1xyXG5cclxuXHR2YXIgcGVyY2VudHNUb3RhbCA9IDEsXHJcblx0XHRwcmVsb2FkZXIgPSAkKCcucHJlbG9hZGVyJyk7XHJcblxyXG5cdHZhciBpbWdQYXRoID0gJCgnKicpLm1hcChmdW5jdGlvbihpbmRleCwgZWxlbWVudCkge1xyXG5cdFx0dmFyIGJncm91bmQgPSAkKGVsZW1lbnQpLmNzcygnYmFja2dyb3VuZC1pbWFnZScpLFxyXG5cdFx0XHRpbWcgPSAkKGVsZW1lbnQpLmlzKCdpbWcnKSxcclxuXHRcdFx0cGF0aCA9ICcnO1xyXG5cclxuXHRcdGlmIChiZ3JvdW5kICE9ICdub25lJykge1xyXG5cdFx0XHRwYXRoID0gYmdyb3VuZC5yZXBsYWNlKCd1cmwoXCInLCAnJykucmVwbGFjZSgnXCIpJywgJycpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChpbWcpIHtcclxuXHRcdFx0cGF0aCA9ICQoZWxlbWVudCkuYXR0cignc3JjJyk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHBhdGgpIHJldHVybiBwYXRoXHJcblx0fSlcclxuXHJcblx0dmFyIHNldFBlcmNlbnRzID0gZnVuY3Rpb24odG90YWwsIGN1cnJlbnQpIHtcclxuXHRcdHZhciBwZXJjZW50cyA9IE1hdGguY2VpbChjdXJyZW50IC8gdG90YWwgKiAxMDApO1xyXG5cclxuXHRcdCQoJy5wcmVsb2FkZXJfX3BlcmNlbnRzJykudGV4dChwZXJjZW50cyk7XHJcblxyXG5cdFx0aWYgKHBlcmNlbnRzID49IDEwMCkge1xyXG5cdFx0XHRwcmVsb2FkZXIuZmFkZU91dCgpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0dmFyIGxvYWRJbWFnZXMgPSBmdW5jdGlvbihpbWFnZXMpIHtcclxuXHJcblx0XHRpZighaW1hZ2VzLmxlbmd0aCkgcHJlbG9hZGVyLmZhZGVPdXQoKTtcclxuXHJcblx0XHRpbWFnZXMuZm9yRWFjaChmdW5jdGlvbihpbWcsIGksIGltYWdlcykge1xyXG5cdFx0XHR2YXIgZmFrZUltZyA9ICQoJzxpbWc+Jywge1xyXG5cdFx0XHRcdGF0dHIgOiB7XHJcblx0XHRcdFx0XHRzcmM6IGltZ1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRmYWtlSW1nLm9uKCdsb2FkIGVycm9yJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0c2V0UGVyY2VudHMoaW1hZ2VzLmxlbmd0aCwgcGVyY2VudHNUb3RhbCk7XHJcblx0XHRcdFx0cGVyY2VudHNUb3RhbCsrO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIHtcclxuXHRcdGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0dmFyIGltZ3MgPSBpbWdQYXRoLnRvQXJyYXkoKTtcclxuXHRcdFx0bG9hZEltYWdlcyhpbWdzKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG59ICgpICk7XHJcblxyXG4kKGZ1bmN0aW9uICgpIHtcclxuXHRwcmVsb2FkZXIuaW5pdCgpO1xyXG59KTsiLCJ2YXIgc2hvd01lbnUgPShmdW5jdGlvbigpIHtcclxuXHR2YXIgbWVudUJ0biA9ICQoJyN0b2dnbGVuYXYnKSxcclxuXHRcdFx0bWVudSA9IFx0JCgnI25hdmlnYXRlJyksXHJcblx0XHRcdG1lbnVJdGVtID0gJCgnLm5hdmlnYXRlLXRvcF9fbGluaycpLFxyXG5cdFx0XHRodG1sID0gJCgnaHRtbCcpLFxyXG5cdFx0XHRhbmltYXRlID0gJCgnLm5hdi1hbmltYXRlJyk7XHJcblxyXG5cdHZhciBvcGVuTWVudSA9IGZ1bmN0aW9uKCl7XHJcblx0XHRtZW51QnRuLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0bWVudS50b2dnbGUoMCwgZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRtZW51LnRvZ2dsZUNsYXNzKCduYXZpZ2F0ZS1zaG93Jyk7XHJcblx0XHRcdFx0bWVudUJ0bi50b2dnbGVDbGFzcygnaGFtYnVyZ2VyX19pY29uLWNsb3NlJyk7XHJcblx0XHRcdFx0aHRtbC50b2dnbGVDbGFzcygnaGlkZVNjcm9sbCcpO1xyXG5cdFx0XHRcdCQoJy5uYXZpZ2F0ZS10b3AnKS5hZGRDbGFzcygnbmF2aWdhdGUtdG9wLWFuaW1hdGUnKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9O1xyXG5cclxuXHRyZXR1cm4ge1xyXG5cdFx0aW5pdDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdG9wZW5NZW51KCk7XHJcblx0XHR9XHJcblx0fVxyXG59ICgpICk7XHJcblxyXG5zaG93TWVudS5pbml0KCk7IiwidmFyIHNsaWRlciA9IChmdW5jdGlvbigpe1xyXG5cdHJldHVybiB7XHJcblx0XHRpbml0OiBmdW5jdGlvbigpe1xyXG5cclxuXHRcdFx0dmFyIF90aGlzID0gdGhpcztcclxuXHJcblx0XHRcdC8vINC00L7QsdCw0LLQu9GP0LXQvCDRgtC+0YfQutC4XHJcblx0XHRcdF90aGlzLm1ha2VEb3RzKCk7XHJcblxyXG5cdFx0XHQvLyDQttC80LXQvCDQutC90L7Qv9C60LhcclxuXHRcdFx0JCgnLnNsaWRlcl9fYnRuJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSl7XHJcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuXHRcdFx0XHR2YXIgJHRoaXMgPSAkKHRoaXMpLFxyXG5cdFx0XHRcdGl0ZW1zID0gJHRoaXMuY2xvc2VzdCgnLnNsaWRlcl9fY29udGFpbmVyJykuZmluZCgnLnNsaWRlcl9faXRlbScpLFxyXG5cdFx0XHRcdGFjdGl2ZUl0ZW0gPSBpdGVtcy5maWx0ZXIoJy5hY3RpdmUnKSxcclxuXHRcdFx0XHRuZXh0SXRlbSA9IGFjdGl2ZUl0ZW0ubmV4dCgpLFxyXG5cdFx0XHRcdHByZXZJdGVtID0gYWN0aXZlSXRlbS5wcmV2KCksXHJcblx0XHRcdFx0Zmlyc3RJdGVtID0gaXRlbXMuZmlyc3QoKSxcclxuXHRcdFx0XHRsYXN0U2xpZGUgPSBpdGVtcy5sYXN0O1xyXG5cclxuXHRcdFx0XHRpZiggJHRoaXMuaGFzQ2xhc3MoJ3NsaWRlcl9fYnRuLW5leHQnKSApe1xyXG5cclxuXHRcdFx0XHRcdGlmIChuZXh0SXRlbS5sZW5ndGgpIHtcclxuXHRcdFx0XHRcdFx0X3RoaXMubW92ZVNsaWRlKG5leHRJdGVtKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdF90aGlzLm1vdmVTbGlkZShmaXJzdEl0ZW0pO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0aWYgKHByZXZJdGVtLmxlbmd0aCkge1xyXG5cdFx0XHRcdFx0XHRfdGhpcy5tb3ZlU2xpZGUocHJldkl0ZW0pO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0X3RoaXMubW92ZVNsaWRlKGxhc3RJdGVtKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fSxcclxuXHJcblx0XHQvLyDQtNCy0LjQs9Cw0LXQvCDRgdC70LDQudC00YtcclxuXHRcdG1vdmVTbGlkZTogZnVuY3Rpb24oc2xpZGUpIHtcclxuXHJcblx0XHRcdFx0dmFyIF90aGlzID0gdGhpcyxcclxuXHRcdFx0XHRcdGNvbnRhaW5lciA9IHNsaWRlLmNsb3Nlc3QoJy5zbGlkZXJfX2NvbnRhaW5lcicpLFxyXG5cdFx0XHRcdFx0aXRlbXMgPSBjb250YWluZXIuZmluZCgnLnNsaWRlcl9faXRlbScpLFxyXG5cdFx0XHRcdFx0YWN0aXZlID0gaXRlbXMuZmlsdGVyKCcuYWN0aXZlJyk7XHJcblxyXG5cdFx0XHRcdGl0ZW1zLmFkZENsYXNzKCdoaWRlU2xpZGUnKS5yZW1vdmVDbGFzcygnYWN0aXZlIHNob3dTbGlkZScpO1xyXG5cdFx0XHRcdHNsaWRlLnJlbW92ZUNsYXNzKCdoaWRlU2xpZGUnKS5hZGRDbGFzcygnYWN0aXZlIHNob3dTbGlkZScpO1xyXG5cclxuXHRcdFx0XHRfdGhpcy5hY3RpdmVEb3QoY29udGFpbmVyLmZpbmQoJy5zbGlkZXJfX2RvdHNfX2l0ZW1zJykpO1xyXG5cdFx0fSwgLy8gbW92ZVNsaWRlXHJcblxyXG5cdFx0bWFrZURvdHM6IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0dmFyIF90aGlzID0gdGhpcyxcclxuXHRcdFx0XHRjb250YWluZXIgPSAkKCcuc2xpZGVyX19jb250YWluZXInKSxcclxuXHRcdFx0XHRkb3RIdG1sID0gJzxsaSBjbGFzcz1cInNsaWRlcl9fZG90c19faXRlbVwiPjxidXR0b24gY2xhc3M9XCJzbGlkZXJfX2RvdHNfX2J0blwiPjwvYnV0dG9uPjwvbGk+JztcclxuXHJcblx0XHRcdGNvbnRhaW5lci5lYWNoKGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0dmFyICR0aGlzID0gJCh0aGlzKSxcclxuXHRcdFx0XHRpdGVtcyA9ICR0aGlzLmZpbmQoJy5zbGlkZXJfX2l0ZW0nKSxcclxuXHRcdFx0XHRkb3RDb250YWluZXIgPSAkdGhpcy5maW5kKCcuc2xpZGVyX19kb3RzX19pdGVtcycpO1xyXG5cclxuXHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGl0ZW1zLnNpemUoKTsgaSsrKSB7XHJcblx0XHRcdFx0XHRkb3RDb250YWluZXIuYXBwZW5kKGRvdEh0bWwpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0X3RoaXMuYWN0aXZlRG90KGRvdENvbnRhaW5lcik7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSwgLy8gbWFrZURvdHNcclxuXHJcblx0XHRhY3RpdmVEb3Q6IGZ1bmN0aW9uKGNvbnRhaW5lcikge1xyXG5cdFx0XHR2YXIgaXRlbXMgPSBjb250YWluZXIuY2xvc2VzdCgnLnNsaWRlcl9fY29udGFpbmVyJykuZmluZCgnLnNsaWRlcl9faXRlbScpO1xyXG5cclxuXHRcdFx0Y29udGFpbmVyXHJcblx0XHRcdFx0LmZpbmQoJy5zbGlkZXJfX2RvdHNfX2l0ZW0nKVxyXG5cdFx0XHRcdC5lcShpdGVtcy5maWx0ZXIoJy5hY3RpdmUnKS5pbmRleCgpKVxyXG5cdFx0XHRcdC5hZGRDbGFzcygnYWN0aXZlJylcclxuXHRcdFx0XHQuc2libGluZ3MoKVxyXG5cdFx0XHRcdC5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcblx0XHR9IC8vIGFjdGl2ZURvdFxyXG5cdH0gLy8gcmV0dXJuXHJcbn0oKSk7XHJcblxyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigkKSB7XHJcblx0aWYgKCQoJy5zbGlkZXJfX2NvbnRhaW5lcicpKSB7XHJcblx0XHRzbGlkZXIuaW5pdCgpO1xyXG5cdH1cclxufSk7IiwiKGZ1bmN0aW9uKCl7XHJcblx0dmFyIGZvcm1WYWxpZGF0ZSA9IHtcclxuXHRcdGRvaXQ6IGZ1bmN0aW9uKCl7XHJcblx0XHRcdHRoaXMubGlzdGVuZXJzKCk7XHJcblx0XHR9LFxyXG5cclxuXHRcdGxpc3RlbmVyczogZnVuY3Rpb24oKXtcclxuXHRcdFx0JCgnI21haWxGb3JtJykub24oJ3N1Ym1pdCcsIGZvcm1WYWxpZGF0ZS5tYWlsbWUpO1xyXG5cdFx0XHQkKCcjbG9naW5Gb3JtJykub24oJ3N1Ym1pdCcsIGZvcm1WYWxpZGF0ZS5sb2dpblZhbGlkKTtcclxuXHRcdH0sXHJcblxyXG5cdFx0bG9naW5WYWxpZDogZnVuY3Rpb24oZSl7XHJcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0dmFyIGZvcm0gPSAkKHRoaXMpO1xyXG5cdFx0XHRpZiAoIGZvcm1WYWxpZGF0ZS52YWxpZChmb3JtKSA9PT0gZmFsc2UgKSByZXR1cm4gZmFsc2U7XHJcblxyXG5cdFx0XHRjb25zb2xlLmxvZygnY29tZSBpbicpO1xyXG5cdFx0fSxcclxuXHJcblx0XHRtYWlsbWU6IGZ1bmN0aW9uKGUpe1xyXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdHZhciBmb3JtID0gJCh0aGlzKTtcclxuXHRcdFx0aWYgKCBmb3JtVmFsaWRhdGUudmFsaWQoZm9ybSkgPT09IGZhbHNlICkgcmV0dXJuIGZhbHNlO1xyXG5cclxuXHRcdFx0dmFyIGZyb20sZW1haWwsbWVzc2FnZTtcclxuXHRcdFx0dmFyIHBhdHRlcm4gPSAvXlthLXowLTlfLV0rQFthLXowLTktXStcXC4oW2Etel17MSw2fVxcLik/W2Etel17Miw2fSQvaTtcclxuXHRcdFx0ZnJvbT0kKFwiI21haWxOYW1lXCIpLnZhbCgpO1xyXG5cdFx0XHRlbWFpbD0kKFwiI21haWxNYWlsXCIpLnZhbCgpO1xyXG5cdFx0XHRtZXNzYWdlPSQoXCIjbWFpbE1lc3NhZ2VcIikudmFsKCk7XHJcblx0XHRcdGlmKGVtYWlsICE9ICcnKXtcclxuXHRcdFx0XHRpZihlbWFpbC5zZWFyY2gocGF0dGVybikgPT0gMCl7XHJcblx0XHRcdFx0XHQkKFwiI21haWxNZXNzYWdlXCIpLnRleHQoXCJTZW5kaW5nIEUtbWFpbC4uLlBsZWFzZSB3YWl0XCIpO1xyXG5cdFx0XHRcdFx0JC5nZXQoXCIuL3NlbmRcIix7ZnJvbTpmcm9tLGVtYWlsOmVtYWlsLG1lc3NhZ2U6bWVzc2FnZX0sZnVuY3Rpb24oZGF0YSl7XHJcblx0XHRcdFx0XHRcdGlmKGRhdGE9PVwic2VudFwiKSB7XHJcblx0XHRcdFx0XHRcdFx0JChcIiNtYWlsRm9ybVwiKS5odG1sKFwiPGRpdj5FbWFpbCBpcyBiZWVuIHNlbnQgYXQgXCIrZnJvbStcIiAuIFBsZWFzZSBjaGVjayBpbmJveCAhPC9kaXY+XCIpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0JCgnaW5wdXQjbWFpbE1haWwnKS5wYXJlbnRzKCcuZm9ybV9fdGV4dCcpLmFkZENsYXNzKCdlcnJvcicpO1xyXG5cdFx0XHRcdFx0JCgnPHNwYW4gY2xhc3M9XCJ0b29sdGlwXCI+0J3QtdC60L7RgNGA0LXQutGC0YDRi9C5IGVtYWlsPC9zcGFuPicpLmFwcGVuZFRvKCcuZXJyb3InKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0Ly92YXIgZm9ybWRhdGEgPSBmb3JtLnNlcmlhbGl6ZSgpO1xyXG5cdFx0XHQvLyAkLmFqYXgoe1xyXG5cdFx0XHQvLyBcdHVybDogJ2Fzc2V0cy9waHAvbWFpbC1wcm9jZXNzLnBocCcsXHJcblx0XHRcdC8vIFx0dHlwZTogJ1BPU1QnLFxyXG5cdFx0XHQvLyBcdGRhdGE6IGZvcm1kYXRhXHJcblx0XHRcdC8vIH0pXHJcblx0XHRcdC8vIC5kb25lKGZ1bmN0aW9uKG1zZykge1xyXG5cdFx0XHQvLyBcdGlmIChtc2cgPT09ICdPSycpIHtcclxuXHRcdFx0Ly8gXHRcdGNvbnNvbGUubG9nKCdPSycpO1xyXG5cdFx0XHQvLyBcdFx0Zm9ybS50cmlnZ2VyKFwicmVzZXRcIik7XHJcblx0XHRcdC8vIFx0fSBlbHNlIHtcclxuXHRcdFx0Ly8gXHRcdCQoJ2lucHV0I21haWxNYWlsJykucGFyZW50cygnLmZvcm1fX3RleHQnKS5hZGRDbGFzcygnZXJyb3InKTtcclxuXHRcdFx0Ly8gXHRcdCQoJzxzcGFuIGNsYXNzPVwidG9vbHRpcFwiPicgKyBtc2cgKyAnPC9zcGFuPicpLmFwcGVuZFRvKCcuZXJyb3InKTtcclxuXHRcdFx0Ly8gXHR9XHJcblx0XHRcdC8vIH0pXHJcblx0XHRcdC8vIC5mYWlsKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQvLyBcdGNvbnNvbGUubG9nKFwiZXJyb3JcIik7XHJcblx0XHRcdC8vIH0pXHJcblx0XHRcdC8vIC5hbHdheXMoZnVuY3Rpb24oKSB7XHJcblx0XHRcdC8vIFx0Y29uc29sZS5sb2coXCJjb21wbGV0ZVwiKTtcclxuXHRcdFx0Ly8gfSk7XHJcblxyXG5cdFx0fSxcclxuXHJcblx0XHR2YWxpZDogZnVuY3Rpb24oZm9ybSl7XHJcblx0XHRcdHZhciBpbnB1dHMgPSBmb3JtLmZpbmQoJ2lucHV0LCB0ZXh0YXJlYScpLFxyXG5cdFx0XHRcdGNoZWNrcyA9IGZvcm0uZmluZCgnaW5wdXQ6Y2hlY2tib3gsIGlucHV0OnJhZGlvJyksXHJcblx0XHRcdFx0Y2hlY2tzT2sgPSBmb3JtLmZpbmQoJ2lucHV0OmNoZWNrZWQnKSxcclxuXHRcdFx0XHR2YWxpZCA9IHRydWU7XHJcblxyXG5cdFx0XHQkLmVhY2goaW5wdXRzLCBmdW5jdGlvbihpbmRleCwgdmFsKSB7XHJcblx0XHRcdFx0dmFyIGlucHV0ID0gJCh2YWwpLFxyXG5cdFx0XHRcdHZhbCA9IGlucHV0LnZhbCgpLFxyXG5cdFx0XHRcdGZvcm1Hcm91cCA9IGlucHV0LnBhcmVudHMoJy5mb3JtX190ZXh0LCAuZm9ybV9fdGV4dF9pY29uJyksXHJcblx0XHRcdFx0bGFiZWwgPSBmb3JtR3JvdXAuZmluZCgnbGFiZWwnKS50ZXh0KCkudG9Mb3dlckNhc2UoKSxcclxuXHRcdFx0XHR0ZXh0RXJyb3IgPSAn0JLRiyDQvdC1INCy0LLQtdC70LggJyArIGxhYmVsLFxyXG5cdFx0XHRcdHRvb2x0aXAgPSAkKCc8c3BhbiBjbGFzcz1cInRvb2x0aXBcIj4nICsgdGV4dEVycm9yICsgJzwvc3Bhbj4nKTtcclxuXHJcblx0XHRcdFx0aWYgKHZhbC5sZW5ndGggPT09IDApe1xyXG5cdFx0XHRcdFx0Zm9ybUdyb3VwLmFkZENsYXNzKCdlcnJvcicpO1xyXG5cdFx0XHRcdFx0Zm9ybUdyb3VwLmZpbmQoJy50b29sdGlwJykucmVtb3ZlKCk7XHJcblx0XHRcdFx0XHR0b29sdGlwLmFwcGVuZFRvKGZvcm1Hcm91cCk7XHJcblx0XHRcdFx0XHRpbnB1dC5vbignZm9jdXMnLCBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdFx0XHRmb3JtR3JvdXAuZmluZCgnLnRvb2x0aXAnKS5yZW1vdmUoKTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0aW5wdXQub24oJ2tleWRvd24nLCBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdFx0XHRmb3JtR3JvdXAucmVtb3ZlQ2xhc3MoJ2Vycm9yJyk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdHZhbGlkID0gZmFsc2U7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGZvcm1Hcm91cC5yZW1vdmVDbGFzcygnZXJyb3InKTtcclxuXHRcdFx0XHRcdGZvcm1Hcm91cC5maW5kKCcudG9vbHRpcCcpLnJlbW92ZSgpO1xyXG5cdFx0XHRcdH07XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0dmFyIGNoZWNrR3JvdXAgPSAkKCcuZm9ybV9fY2hlY2tzJyksXHJcblx0XHRcdFx0dG9vbHRpcCA9ICQoJzxzcGFuIGNsYXNzPVwidG9vbHRpcFwiPtCg0L7QsdC+0YLQsNC8INGC0YPRgiDQvdC1INC80LXRgdGC0L48L3NwYW4+Jyk7XHJcblxyXG5cdFx0XHRpZiAoY2hlY2tzLmxlbmd0aCA+IDApIHtcclxuXHJcblx0XHRcdFx0aWYgKGNoZWNrc09rLmxlbmd0aCA8IDIpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdjaGVjayBzb21lb25lJyk7XHJcblx0XHRcdFx0XHRjaGVja0dyb3VwLmZpbmQoJy50b29sdGlwJykucmVtb3ZlKCk7XHJcblx0XHRcdFx0XHR0b29sdGlwLmFwcGVuZFRvKGNoZWNrR3JvdXApO1xyXG5cdFx0XHRcdFx0dmFsaWQgPSBmYWxzZTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Y2hlY2tHcm91cC5maW5kKCcudG9vbHRpcCcpLnJlbW92ZSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gdmFsaWQ7XHJcblx0XHR9XHJcblxyXG5cdH1cclxuXHJcblx0Zm9ybVZhbGlkYXRlLmRvaXQoKTtcclxufSgpKTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
