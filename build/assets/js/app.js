'use strict';

var doc = document,
	jDoc = $(document);

var svg4everybody = (function(){
	svg4everybody();
}());
(function(){

	var addPost = {

		doit: function(){
			this.listeners();
		},

		listeners: function() {
			$('#addPost').on('submit', addPost.addPostInBlog);
		},

		addPostInBlog: function(e){
			e.preventDefault();
			var form = $(this),
				inputs = $(this).find('input').val();
			if (inputs.length > 0) {
				var dataForm = $(this).serializeArray();
				$.ajax({
					url: '/savepost',
					type: 'POST',
					dataType: 'json',
					data: dataForm
				})
				.done(function() {
					console.log("success");
				})
				.fail(function() {
					console.log("error");
				})
				.always(function() {
					console.log("complete");
				});

			} else {
				console.log('empty');
			}

		}

	}

	addPost.doit();

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
			if (bg) {
				this.move(bg, wScroll, 60);
			}
			if (sectionText) {
				this.move(sectionText, wScroll, 30);
			}
			if (user) {
				this.move(user, wScroll, 50);
			}
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

			var _this = this,
				sliderItemActive = $('.slider__item').first().addClass('active');

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

			//клик по точкам
			$('.slider__dots__items').on('click', '.slider__dots__item', function(e){
				e.preventDefault();
				var $this = $(this),
					dotClick = $this.index(),
					slide = $('.slider__item'),
					activeItem = slide.filter('.active');

					if (activeItem.index() < dotClick) {
						_this.moveSlide(slide.eq(dotClick));
					} else {
						_this.moveSlide(slide.eq(dotClick));
					}
			})
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
	var smothscroll = {
		doit: function(){
			this.listeners();
		},

		listeners: function(){
			$('#arrowDown').on('click', smothscroll.scrollDown);
			$('#arrowUp').on('click', smothscroll.scrollUp);
		},

		scrollDown: function(e){
			e.preventDefault();
			var headerHeight = $('.header').height();
			$('body').animate({scrollTop: headerHeight}, 1000);
		},

		scrollUp: function(e){
			e.preventDefault();
			$('body').animate({scrollTop: 0}, 2000);
		}
	}

	smothscroll.doit();
}());
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

			var from,email,message,data;
			var pattern = /^[a-z0-9_-]+@[a-z0-9-]+\.([a-z]{1,6}\.)?[a-z]{2,6}$/i;
			from=$("#mailName").val();
			email=$("#mailMail").val();
			message=$("#mailMessage").val();
			data = form.serialize();
			if(email != ''){
				if(email.search(pattern) == 0){
					$.ajax({
						url: '/send',
						type: 'POST',
						data: data
					})
					.done(function() {
						console.log("success");
						form.slideUp(200);
						$('.window__menu').hide();
						$('.form__succes').show();
					})
					.fail(function() {
						console.log("error");
						form.slideUp(200);
						$('.window__menu').hide();
						$('.form__error').show();
					})
				} else {
					$('input#mailMail').parents('.form__text').addClass('error');
					$('<span class="tooltip">Некорректрый email</span>').appendTo('.error');
				}
			}
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFkZFBvc3QuanMiLCJibG9nbWVudS5qcyIsImJsdXIuanMiLCJmaXhlZC1ibG9nLW1lbnUuanMiLCJmbGlwLmpzIiwicGFyYWxheC5qcyIsInByZWxvYWRlci5qcyIsInNob3dtZW51LmpzIiwic2xpZGVyLmpzIiwic21vb3Roc2Nyb29sLmpzIiwidmFsaWRhdGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIGRvYyA9IGRvY3VtZW50LFxyXG5cdGpEb2MgPSAkKGRvY3VtZW50KTtcclxuXHJcbnZhciBzdmc0ZXZlcnlib2R5ID0gKGZ1bmN0aW9uKCl7XHJcblx0c3ZnNGV2ZXJ5Ym9keSgpO1xyXG59KCkpOyIsIihmdW5jdGlvbigpe1xyXG5cclxuXHR2YXIgYWRkUG9zdCA9IHtcclxuXHJcblx0XHRkb2l0OiBmdW5jdGlvbigpe1xyXG5cdFx0XHR0aGlzLmxpc3RlbmVycygpO1xyXG5cdFx0fSxcclxuXHJcblx0XHRsaXN0ZW5lcnM6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQkKCcjYWRkUG9zdCcpLm9uKCdzdWJtaXQnLCBhZGRQb3N0LmFkZFBvc3RJbkJsb2cpO1xyXG5cdFx0fSxcclxuXHJcblx0XHRhZGRQb3N0SW5CbG9nOiBmdW5jdGlvbihlKXtcclxuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHR2YXIgZm9ybSA9ICQodGhpcyksXHJcblx0XHRcdFx0aW5wdXRzID0gJCh0aGlzKS5maW5kKCdpbnB1dCcpLnZhbCgpO1xyXG5cdFx0XHRpZiAoaW5wdXRzLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHR2YXIgZGF0YUZvcm0gPSAkKHRoaXMpLnNlcmlhbGl6ZUFycmF5KCk7XHJcblx0XHRcdFx0JC5hamF4KHtcclxuXHRcdFx0XHRcdHVybDogJy9zYXZlcG9zdCcsXHJcblx0XHRcdFx0XHR0eXBlOiAnUE9TVCcsXHJcblx0XHRcdFx0XHRkYXRhVHlwZTogJ2pzb24nLFxyXG5cdFx0XHRcdFx0ZGF0YTogZGF0YUZvcm1cclxuXHRcdFx0XHR9KVxyXG5cdFx0XHRcdC5kb25lKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coXCJzdWNjZXNzXCIpO1xyXG5cdFx0XHRcdH0pXHJcblx0XHRcdFx0LmZhaWwoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcImVycm9yXCIpO1xyXG5cdFx0XHRcdH0pXHJcblx0XHRcdFx0LmFsd2F5cyhmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiY29tcGxldGVcIik7XHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKCdlbXB0eScpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHR9XHJcblxyXG5cdGFkZFBvc3QuZG9pdCgpO1xyXG5cclxufSgpKTsiLCIvLyDQvdCw0LLQuNCz0LDRhtC40Y8g0LIg0LHQu9C+0LPQtVxyXG5cclxudmFyIGNoZWNrU2VjdGlvbiA9IChmdW5jdGlvbiAoKXtcclxuXHQvLyBwcml2YXRlXHJcblx0dmFyIGZvbGxvd0Jsb2dMaW5rID0gZnVuY3Rpb24oZWRnZSl7XHJcblx0XHQkKCcuYmxvZ19fcG9zdCcpLmVhY2goZnVuY3Rpb24oaSwgZWwpe1xyXG5cdFx0XHRcdHZhciAkdGhpcyA9ICQodGhpcyksXHJcblx0XHRcdFx0dG9wRWRnZSA9ICR0aGlzLm9mZnNldCgpLnRvcCAtIGVkZ2UsXHJcblx0XHRcdFx0Ym90dG9tRWRnZSA9IHRvcEVkZ2UgKyAkdGhpcy5oZWlnaHQoKSxcclxuXHRcdFx0XHR3U2Nyb2xsID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xyXG5cclxuXHRcdFx0XHRpZiAodG9wRWRnZSA8IHdTY3JvbGwgJiYgYm90dG9tRWRnZSA+IHdTY3JvbGwpIHtcclxuXHRcdFx0XHRcdHZhciBjdXJyZW50SWQgPSAkdGhpcy5kYXRhKCdzZWN0aW9uJyksXHJcblx0XHRcdFx0XHRcdHJlcUxpbmsgPSAkKCcuYmxvZ19fbmF2X19saW5rJykuZmlsdGVyKCdbaHJlZiA9IFwiIycgKyBjdXJyZW50SWQgKyAnXCJdJyk7XHJcblxyXG5cdFx0XHRcdFx0cmVxTGluay5jbG9zZXN0KCcuYmxvZ19fbmF2X19pdGVtJykuYWRkQ2xhc3MoJ2FjdGl2ZScpXHJcblx0XHRcdFx0XHRcdC5zaWJsaW5ncygpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdH07XHJcblxyXG5cdC8vIHB1YmxpY1xyXG5cdHJldHVybiB7XHJcblx0XHRpbml0OiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIHdXaWR0aCA9ICQod2luZG93KS53aWR0aCgpO1xyXG5cdFx0XHRpZiAoIHdXaWR0aCA+IDc2OCApIHtcclxuXHRcdFx0XHRmb2xsb3dCbG9nTGluayg3MCk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Zm9sbG93QmxvZ0xpbmsoMjAwKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxufSgpKTtcclxuXHJcbiQod2luZG93KS5zY3JvbGwoZnVuY3Rpb24oKXtcclxuXHRjaGVja1NlY3Rpb24uaW5pdCgpO1xyXG59KTsiLCJ2YXIgYmx1ciA9IGZ1bmN0aW9uICgpIHtcclxuXHR2YXIgd3JhcHBlciA9IGRvYy5xdWVyeVNlbGVjdG9yKCcuYmx1cl9fd3JhcHBlcicpLFxyXG5cdFx0Zm9ybSA9IGRvYy5xdWVyeVNlbGVjdG9yKCcuYmx1cl9fZm9ybScpO1xyXG5cclxuXHRyZXR1cm4gZnVuY3Rpb24oKSB7XHJcblx0XHRcdGlmICh3cmFwcGVyLCBmb3JtKSB7XHJcblx0XHRcdFx0dmFyIGltZ1dpZHRoID0gZG9jLnF1ZXJ5U2VsZWN0b3IoJy5ibHVyX19iYWNrZ3JvdW5kJykub2Zmc2V0V2lkdGgsXHJcblx0XHRcdFx0XHRwb3NMZWZ0ID0gLXdyYXBwZXIub2Zmc2V0TGVmdCxcclxuXHRcdFx0XHRcdHBvc1RvcCA9IC13cmFwcGVyLm9mZnNldFRvcCxcclxuXHRcdFx0XHRcdGJsdXJDU1MgPSBmb3JtLnN0eWxlO1xyXG5cclxuXHRcdFx0XHRibHVyQ1NTLmJhY2tncm91bmRTaXplID0gaW1nV2lkdGggKyAncHggJyArICdhdXRvJztcclxuXHRcdFx0XHRibHVyQ1NTLmJhY2tncm91bmRQb3NpdGlvbiA9IHBvc0xlZnQgKyAncHggJyArIHBvc1RvcCArICdweCc7XHJcblx0XHRcdH1cclxuXHRcdH1cclxufTtcclxuXHJcbnZhciBtYWtlQmx1ciA9IGJsdXIoKTtcclxuXHJcbm1ha2VCbHVyKCk7XHJcblxyXG53aW5kb3cub25yZXNpemUgPSBmdW5jdGlvbiAoKSB7XHJcblx0bWFrZUJsdXIoKTtcclxufTsiLCJ2YXIgZml4ZWRCbG9nTWVudSA9IChmdW5jdGlvbiAoKSB7XHJcblx0Ly8gcHJpdmF0ZVxyXG5cdHZhciBtb3ZlTWVudSA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdHZhciB3V2lkdGggPSAkKHdpbmRvdykud2lkdGgoKTtcclxuXHJcblx0XHRpZiAoIHdXaWR0aCA+IDc2OCApIHtcclxuXHRcdFx0Y29uc29sZS5sb2cod1dpZHRoKTtcclxuXHRcdFx0dmFyIG1lbnVXaWR0aCA9ICQoJy5ibG9nX19uYXZfX2l0ZW1zJykud2lkdGgoKSxcclxuXHRcdFx0d1Njcm9sbCA9ICQod2luZG93KS5zY3JvbGxUb3AoKSxcclxuXHRcdFx0b2Zmc2V0ID0gJCgnLmJsb2dfX25hdicpLm9mZnNldCgpLFxyXG5cdFx0XHRtZW51ID0gJCgnLmJsb2dfX25hdl9faXRlbXMnKTtcclxuXHJcblx0XHRcdGlmICggKG9mZnNldC50b3AgLSA3MCkgPCB3U2Nyb2xsICkge1xyXG5cdFx0XHRcdG1lbnUuYWRkQ2xhc3MoJ2Jsb2dfX25hdl9faXRlbXMtZml4ZWQnKTtcclxuXHRcdFx0XHRtZW51LmNzcyh7d2lkdGg6IG1lbnVXaWR0aCwgbGVmdDogb2Zmc2V0LmxlZnQgKyA5fSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0bWVudS5yZW1vdmVDbGFzcygnYmxvZ19fbmF2X19pdGVtcy1maXhlZCcpO1xyXG5cdFx0XHRcdG1lbnUucmVtb3ZlQXR0cignc3R5bGUnKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH0gLy8gaWZcclxuXHR9O1xyXG5cclxuXHR2YXIgc3dpcGVNZW51ID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0JCgnLmpzLW1vYkJ1dHRvbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpe1xyXG5cclxuXHRcdFx0JCgnLmJsb2dfX25hdicpLnRvZ2dsZUNsYXNzKCdqcy1zaG93TWVudScpO1xyXG5cdFx0XHQkKCcud3JhcHBlci1ibG9nJykudG9nZ2xlQ2xhc3MoJ2pzLW1vdmVMZWZ0Jyk7XHJcblxyXG5cdFx0fSk7XHJcblx0fTtcclxuXHJcblx0Ly8gcHVibGljXHJcblx0cmV0dXJuIHtcclxuXHRcdGZpeGVkbWVudTogZnVuY3Rpb24oKSB7XHJcblx0XHRcdGlmICggJCgnLmJsb2dfX25hdicpLmxlbmd0aCApIHtcclxuXHRcdFx0XHRcdG1vdmVNZW51KCk7XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblxyXG5cdFx0b3Blbk1lbnU6IGZ1bmN0aW9uKCl7XHJcblx0XHRcdGlmICggJCgnLmJsb2dfX25hdicpLmxlbmd0aCApIHtcclxuXHRcdFx0XHRzd2lwZU1lbnUoKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcbn0oKSk7IC8vIGVuZCBtYWluIGZ1bmN0aW9uXHJcblxyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcclxuXHQkKHdpbmRvdykuc2Nyb2xsKGZ1bmN0aW9uKGV2ZW50KSB7XHJcblx0XHRmaXhlZEJsb2dNZW51LmZpeGVkbWVudSgpO1xyXG5cdH0pO1xyXG5cdCQod2luZG93KS5yZXNpemUoZnVuY3Rpb24oZXZlbnQpIHtcclxuXHRcdGZpeGVkQmxvZ01lbnUuZml4ZWRtZW51KCk7XHJcblx0fSk7XHJcblx0Zml4ZWRCbG9nTWVudS5vcGVuTWVudSgpO1xyXG59KTtcclxuXHJcblxyXG4iLCJ2YXIgZmxpcEVmZmVjdCA9IChmdW5jdGlvbigpIHtcclxuXHR2YXIgZmxpcEJ0biA9ICQoJy5mbGlwLWJ0bicpLFxyXG5cdFx0ZmxpcFJldHVybiA9ICQoJy5mbGlwLWJ0bi1yZXR1cm4nKSxcclxuXHRcdGNvbnRhaW5lciA9ICQoJy5mbGlwY29udGFpbmVyJyk7XHJcblxyXG5cdHJldHVybiB7XHJcblx0XHRpbml0OiBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGZsaXBCdG4ub24oJ2NsaWNrJywgZnVuY3Rpb24oZSl7XHJcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRcdGNvbnRhaW5lci50b2dnbGVDbGFzcygnZmxpcCcpO1xyXG5cdFx0XHRcdGZsaXBCdG4udG9nZ2xlQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdFx0XHQkKCcudG9vbHRpcCcpLnJlbW92ZSgpO1xyXG5cdFx0XHRcdCQoJy5mb3JtJykuZmluZCgnLmVycm9yJykucmVtb3ZlQ2xhc3MoXCJlcnJvclwiKTtcclxuXHRcdFx0XHQkKCdmb3JtJylbMF0ucmVzZXQoKTtcclxuXHRcdFx0fSk7XHJcblx0XHRcdGZsaXBSZXR1cm4ub24oJ2NsaWNrJywgZnVuY3Rpb24oZSl7XHJcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRcdGNvbnRhaW5lci50b2dnbGVDbGFzcygnZmxpcCcpO1xyXG5cdFx0XHRcdGZsaXBCdG4udG9nZ2xlQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdFx0fSk7XHJcblx0XHRcdC8vINC/0LXRgNC10LLQvtGA0LDRh9C40LLQsNC10Lwg0YTQvtGA0LzRgyDQv9C+INC60LvQuNC60YMg0LLQvdC1INGE0L7RgNC80YtcclxuXHRcdFx0akRvYy5tb3VzZXVwKGZ1bmN0aW9uIChlKSB7XHJcblx0XHRcdFx0aWYgKGNvbnRhaW5lci5oYXMoZS50YXJnZXQpLmxlbmd0aCA9PT0gMCl7XHJcblx0XHRcdFx0XHRjb250YWluZXIucmVtb3ZlQ2xhc3MoJ2ZsaXAnKTtcclxuXHRcdFx0XHRcdGZsaXBCdG4ucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcbn07XHJcbn0oKSk7XHJcblxyXG5mbGlwRWZmZWN0LmluaXQoKTsiLCIvLyDRgdC+0LfQtNCw0LXQvCDQv9Cw0YDQsNC70LDQutGBXHJcbnZhciBwYXJhbGxheCA9IChmdW5jdGlvbiAoKSB7XHJcblx0Ly8g0LHQtdGA0LXQvCDRjdC70LXQvNC10L3RgtGLLCDQutC+0YLQvtGA0YvQtSDQsdGD0LTQtdC8INC00LLQuNCz0LDRgtGMXHJcblx0dmFyXHRiZyA9IGRvYy5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19waWN0dXJlJyksIC8vINCx0LXRgNC10Lwg0LHQu9C+0Log0YEg0LrQsNGA0YLQuNC90LrQvtC5XHJcblx0XHR1c2VyID0gZG9jLnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX3VzZXInKSwgLy8g0LHQu9C+0Log0YEg0Y7Qt9C10YDQvtC8XHJcblx0XHRzZWN0aW9uVGV4dCA9IGRvYy5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19pY29uJyk7IC8vINCx0LvQvtC6INGBIFBvcnRmb2xpb1xyXG5cdC8vINCy0L7Qt9Cy0YDQsNGJ0LDQtdC8INGA0LXQt9GD0LvRjNGC0LDRgiDRhNGD0L3QutGG0LjQuFxyXG5cdHJldHVybiB7XHJcblx0XHQvLyBtb3ZlXHJcblx0XHRtb3ZlOiBmdW5jdGlvbiAoYmxvY2ssd2luZG93U2Nyb2xsLHN0cmFmZUFtb3VudCkge1xyXG5cdFx0XHQvLyBibG9jayAtINC60LDQutC+0Lkg0LHQu9C+0Log0LTQstC40LPQsNC10LxcclxuXHRcdFx0Ly8gd2luZG93U2Nyb2xsIC0g0L3QsCDRgdC60L7Qu9GM0LrQviDQv9GA0L7Qu9C40YHRgtCw0LvQuCDRgdGC0YDQsNC90LjRhtGDXHJcblx0XHRcdC8vIHN0cmFmZUFtb3VudCAtINC60L7RjdGE0YTQtdGG0LjQtdC90YIsINC90LAg0LrQvtGC0L7RgNGL0Lkg0LHRg9C00LXQvCDQtNC10LvQuNGC0Ywg0LTQu9GPINGB0LrQvtGA0L7RgdGC0LhcclxuXHRcdFx0Ly8g0LLRi9GH0LjRgdC70Y/QtdC8INC30L3QsNGH0LXQvdC40LUg0LTQu9GPINC00LLQuNC20LXQvdC40Y8g0LIg0L/RgNC+0YbQtdC90YLQsNGFXHJcblx0XHRcdHZhciBzdHJhZmUgPSB3aW5kb3dTY3JvbGwgLyAtc3RyYWZlQW1vdW50ICsgJyUnO1xyXG5cdFx0XHQvLyDQv9C10YDQtdC60LvRjtGH0LDQtdC8INC90LDQs9GA0YPQt9C60YMg0L3QsCDQstC40LTQtdC+0LrQsNGA0YLRg1xyXG5cdFx0XHR2YXIgdHJhbnNmb3JtU3RyaW5nID0gJ3RyYW5zbGF0ZTNkKDAsJyArIHN0cmFmZSArICcsMCknO1xyXG5cdFx0XHQvLyDQtNC+0LHQsNCy0LvRj9C10Lwg0YHRgtC40LvRjCDQuiDQvdCw0YjQtdC80YMg0LHQu9C+0LrRg1xyXG5cdFx0XHR2YXIgc3R5bGUgPSBibG9jay5zdHlsZTtcclxuXHRcdFx0Ly8g0LjRgdC/0L7Qu9GM0LfRg9C10LwgdHJhbnNmb3JtINC00LvRjyDRgdC80LXRidC10L3QuNGPXHJcblx0XHRcdC8vINCyINGN0YLQvtC8INGB0LvRg9GH0LDQtSDQv9GA0L7RgdGH0LXRgiDQvtGB0YPRidC10YHRgtCy0LvRj9C10YLRgdGPINGC0L7Qu9GM0LrQviDQvtC00LjQvSDRgNCw0LcsINGH0YLQviDRgdC90LjQttCw0LXRgiDQvdCw0LPRgNGD0LfQutGDXHJcblx0XHRcdHN0eWxlLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVN0cmluZztcclxuXHRcdFx0c3R5bGUud2Via2l0VHJhbnNmb3JtID0gdHJhbnNmb3JtU3RyaW5nO1xyXG5cdFx0XHQvLyDQv9GA0LjRgdCy0LDQuNCy0LDQtdC8INC30L3QsNGH0LXQvdC40Y4gJ3RvcCcg0L/QtdGA0LXQvNC10L3QvdGD0Y4gc3RyYWZlIC0g0Y3RgtC+INCx0YPQtNC10YIg0L/RgNC+0YbQtdC90YIg0YHQvNC10YnQtdC90LjRj1xyXG5cdFx0XHRzdHlsZS50b3AgPSBzdHJhZmU7XHJcblx0XHR9LFxyXG5cdFx0Ly8gaW5pdFxyXG5cdFx0aW5pdDogZnVuY3Rpb24od1Njcm9sbCkge1xyXG5cdFx0XHQvLyDQtNCy0LjQs9Cw0LXQvCAnYmcnINCyINC30LDQstC40YHQuNC80L7RgdGC0Lgg0L7RgiAnd1Njcm9sbCcg0Lgg0LfQsNC00LDQtdC8INC60L7RjdGE0YTQuNGG0LjQtdGCICjRh9C10Lwg0L7QvSDQsdC+0LvRjNGI0LUsINGC0LXQvCDQvNC10LTQu9C10L3QvdC10LUg0LTQstC40LPQsNC10YLRgdGPKVxyXG5cdFx0XHRpZiAoYmcpIHtcclxuXHRcdFx0XHR0aGlzLm1vdmUoYmcsIHdTY3JvbGwsIDYwKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoc2VjdGlvblRleHQpIHtcclxuXHRcdFx0XHR0aGlzLm1vdmUoc2VjdGlvblRleHQsIHdTY3JvbGwsIDMwKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAodXNlcikge1xyXG5cdFx0XHRcdHRoaXMubW92ZSh1c2VyLCB3U2Nyb2xsLCA1MCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcbn0oKSk7XHJcblxyXG53aW5kb3cub25zY3JvbGwgPSBmdW5jdGlvbigpIHtcclxuXHQvLyDRg9C30L3QsNC10Lwg0L3QsCDRgdC60L7Qu9GM0LrQviDQv9GA0L7QutGA0YPRgtC40LvQuCDRgdGC0YDQsNC90LjRhtGDXHJcblx0dmFyIHdTY3JvbGwgPSB3aW5kb3cucGFnZVlPZmZzZXQ7XHJcblxyXG5cdC8vINCy0YvQt9GL0LLQsNC10LwgcGFyYWxsYXgg0L/QviDRgdC60YDQvtC70LvRg1xyXG5cdHBhcmFsbGF4LmluaXQod1Njcm9sbCk7XHJcbn07IiwidmFyIHByZWxvYWRlciA9IChmdW5jdGlvbigpe1xyXG5cclxuXHR2YXIgcGVyY2VudHNUb3RhbCA9IDEsXHJcblx0XHRwcmVsb2FkZXIgPSAkKCcucHJlbG9hZGVyJyk7XHJcblxyXG5cdHZhciBpbWdQYXRoID0gJCgnKicpLm1hcChmdW5jdGlvbihpbmRleCwgZWxlbWVudCkge1xyXG5cdFx0dmFyIGJncm91bmQgPSAkKGVsZW1lbnQpLmNzcygnYmFja2dyb3VuZC1pbWFnZScpLFxyXG5cdFx0XHRpbWcgPSAkKGVsZW1lbnQpLmlzKCdpbWcnKSxcclxuXHRcdFx0cGF0aCA9ICcnO1xyXG5cclxuXHRcdGlmIChiZ3JvdW5kICE9ICdub25lJykge1xyXG5cdFx0XHRwYXRoID0gYmdyb3VuZC5yZXBsYWNlKCd1cmwoXCInLCAnJykucmVwbGFjZSgnXCIpJywgJycpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChpbWcpIHtcclxuXHRcdFx0cGF0aCA9ICQoZWxlbWVudCkuYXR0cignc3JjJyk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHBhdGgpIHJldHVybiBwYXRoXHJcblx0fSlcclxuXHJcblx0dmFyIHNldFBlcmNlbnRzID0gZnVuY3Rpb24odG90YWwsIGN1cnJlbnQpIHtcclxuXHRcdHZhciBwZXJjZW50cyA9IE1hdGguY2VpbChjdXJyZW50IC8gdG90YWwgKiAxMDApO1xyXG5cclxuXHRcdCQoJy5wcmVsb2FkZXJfX3BlcmNlbnRzJykudGV4dChwZXJjZW50cyk7XHJcblxyXG5cdFx0aWYgKHBlcmNlbnRzID49IDEwMCkge1xyXG5cdFx0XHRwcmVsb2FkZXIuZmFkZU91dCgpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0dmFyIGxvYWRJbWFnZXMgPSBmdW5jdGlvbihpbWFnZXMpIHtcclxuXHJcblx0XHRpZighaW1hZ2VzLmxlbmd0aCkgcHJlbG9hZGVyLmZhZGVPdXQoKTtcclxuXHJcblx0XHRpbWFnZXMuZm9yRWFjaChmdW5jdGlvbihpbWcsIGksIGltYWdlcykge1xyXG5cdFx0XHR2YXIgZmFrZUltZyA9ICQoJzxpbWc+Jywge1xyXG5cdFx0XHRcdGF0dHIgOiB7XHJcblx0XHRcdFx0XHRzcmM6IGltZ1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRmYWtlSW1nLm9uKCdsb2FkIGVycm9yJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0c2V0UGVyY2VudHMoaW1hZ2VzLmxlbmd0aCwgcGVyY2VudHNUb3RhbCk7XHJcblx0XHRcdFx0cGVyY2VudHNUb3RhbCsrO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIHtcclxuXHRcdGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0dmFyIGltZ3MgPSBpbWdQYXRoLnRvQXJyYXkoKTtcclxuXHRcdFx0bG9hZEltYWdlcyhpbWdzKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG59ICgpICk7XHJcblxyXG4kKGZ1bmN0aW9uICgpIHtcclxuXHRwcmVsb2FkZXIuaW5pdCgpO1xyXG59KTsiLCJ2YXIgc2hvd01lbnUgPShmdW5jdGlvbigpIHtcclxuXHR2YXIgbWVudUJ0biA9ICQoJyN0b2dnbGVuYXYnKSxcclxuXHRcdFx0bWVudSA9IFx0JCgnI25hdmlnYXRlJyksXHJcblx0XHRcdG1lbnVJdGVtID0gJCgnLm5hdmlnYXRlLXRvcF9fbGluaycpLFxyXG5cdFx0XHRodG1sID0gJCgnaHRtbCcpLFxyXG5cdFx0XHRhbmltYXRlID0gJCgnLm5hdi1hbmltYXRlJyk7XHJcblxyXG5cdHZhciBvcGVuTWVudSA9IGZ1bmN0aW9uKCl7XHJcblx0XHRtZW51QnRuLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0bWVudS50b2dnbGUoMCwgZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRtZW51LnRvZ2dsZUNsYXNzKCduYXZpZ2F0ZS1zaG93Jyk7XHJcblx0XHRcdFx0bWVudUJ0bi50b2dnbGVDbGFzcygnaGFtYnVyZ2VyX19pY29uLWNsb3NlJyk7XHJcblx0XHRcdFx0aHRtbC50b2dnbGVDbGFzcygnaGlkZVNjcm9sbCcpO1xyXG5cdFx0XHRcdCQoJy5uYXZpZ2F0ZS10b3AnKS5hZGRDbGFzcygnbmF2aWdhdGUtdG9wLWFuaW1hdGUnKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9O1xyXG5cclxuXHRyZXR1cm4ge1xyXG5cdFx0aW5pdDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdG9wZW5NZW51KCk7XHJcblx0XHR9XHJcblx0fVxyXG59ICgpICk7XHJcblxyXG5zaG93TWVudS5pbml0KCk7IiwidmFyIHNsaWRlciA9IChmdW5jdGlvbigpe1xyXG5cdHJldHVybiB7XHJcblx0XHRpbml0OiBmdW5jdGlvbigpe1xyXG5cclxuXHRcdFx0dmFyIF90aGlzID0gdGhpcyxcclxuXHRcdFx0XHRzbGlkZXJJdGVtQWN0aXZlID0gJCgnLnNsaWRlcl9faXRlbScpLmZpcnN0KCkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cclxuXHRcdFx0Ly8g0LTQvtCx0LDQstC70Y/QtdC8INGC0L7Rh9C60LhcclxuXHRcdFx0X3RoaXMubWFrZURvdHMoKTtcclxuXHJcblx0XHRcdC8vINC20LzQtdC8INC60L3QvtC/0LrQuFxyXG5cdFx0XHQkKCcuc2xpZGVyX19idG4nKS5vbignY2xpY2snLCBmdW5jdGlvbihlKXtcclxuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG5cdFx0XHRcdHZhciAkdGhpcyA9ICQodGhpcyksXHJcblx0XHRcdFx0aXRlbXMgPSAkdGhpcy5jbG9zZXN0KCcuc2xpZGVyX19jb250YWluZXInKS5maW5kKCcuc2xpZGVyX19pdGVtJyksXHJcblx0XHRcdFx0YWN0aXZlSXRlbSA9IGl0ZW1zLmZpbHRlcignLmFjdGl2ZScpLFxyXG5cdFx0XHRcdG5leHRJdGVtID0gYWN0aXZlSXRlbS5uZXh0KCksXHJcblx0XHRcdFx0cHJldkl0ZW0gPSBhY3RpdmVJdGVtLnByZXYoKSxcclxuXHRcdFx0XHRmaXJzdEl0ZW0gPSBpdGVtcy5maXJzdCgpLFxyXG5cdFx0XHRcdGxhc3RTbGlkZSA9IGl0ZW1zLmxhc3Q7XHJcblxyXG5cdFx0XHRcdGlmKCAkdGhpcy5oYXNDbGFzcygnc2xpZGVyX19idG4tbmV4dCcpICl7XHJcblxyXG5cdFx0XHRcdFx0aWYgKG5leHRJdGVtLmxlbmd0aCkge1xyXG5cdFx0XHRcdFx0XHRfdGhpcy5tb3ZlU2xpZGUobmV4dEl0ZW0pO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0X3RoaXMubW92ZVNsaWRlKGZpcnN0SXRlbSk7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRpZiAocHJldkl0ZW0ubGVuZ3RoKSB7XHJcblx0XHRcdFx0XHRcdF90aGlzLm1vdmVTbGlkZShwcmV2SXRlbSk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRfdGhpcy5tb3ZlU2xpZGUobGFzdEl0ZW0pO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHQvL9C60LvQuNC6INC/0L4g0YLQvtGH0LrQsNC8XHJcblx0XHRcdCQoJy5zbGlkZXJfX2RvdHNfX2l0ZW1zJykub24oJ2NsaWNrJywgJy5zbGlkZXJfX2RvdHNfX2l0ZW0nLCBmdW5jdGlvbihlKXtcclxuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0dmFyICR0aGlzID0gJCh0aGlzKSxcclxuXHRcdFx0XHRcdGRvdENsaWNrID0gJHRoaXMuaW5kZXgoKSxcclxuXHRcdFx0XHRcdHNsaWRlID0gJCgnLnNsaWRlcl9faXRlbScpLFxyXG5cdFx0XHRcdFx0YWN0aXZlSXRlbSA9IHNsaWRlLmZpbHRlcignLmFjdGl2ZScpO1xyXG5cclxuXHRcdFx0XHRcdGlmIChhY3RpdmVJdGVtLmluZGV4KCkgPCBkb3RDbGljaykge1xyXG5cdFx0XHRcdFx0XHRfdGhpcy5tb3ZlU2xpZGUoc2xpZGUuZXEoZG90Q2xpY2spKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdF90aGlzLm1vdmVTbGlkZShzbGlkZS5lcShkb3RDbGljaykpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHR9KVxyXG5cdFx0fSxcclxuXHJcblx0XHQvLyDQtNCy0LjQs9Cw0LXQvCDRgdC70LDQudC00YtcclxuXHRcdG1vdmVTbGlkZTogZnVuY3Rpb24oc2xpZGUpIHtcclxuXHJcblx0XHRcdFx0dmFyIF90aGlzID0gdGhpcyxcclxuXHRcdFx0XHRcdGNvbnRhaW5lciA9IHNsaWRlLmNsb3Nlc3QoJy5zbGlkZXJfX2NvbnRhaW5lcicpLFxyXG5cdFx0XHRcdFx0aXRlbXMgPSBjb250YWluZXIuZmluZCgnLnNsaWRlcl9faXRlbScpLFxyXG5cdFx0XHRcdFx0YWN0aXZlID0gaXRlbXMuZmlsdGVyKCcuYWN0aXZlJyk7XHJcblxyXG5cdFx0XHRcdGl0ZW1zLmFkZENsYXNzKCdoaWRlU2xpZGUnKS5yZW1vdmVDbGFzcygnYWN0aXZlIHNob3dTbGlkZScpO1xyXG5cdFx0XHRcdHNsaWRlLnJlbW92ZUNsYXNzKCdoaWRlU2xpZGUnKS5hZGRDbGFzcygnYWN0aXZlIHNob3dTbGlkZScpO1xyXG5cclxuXHRcdFx0XHRfdGhpcy5hY3RpdmVEb3QoY29udGFpbmVyLmZpbmQoJy5zbGlkZXJfX2RvdHNfX2l0ZW1zJykpO1xyXG5cdFx0fSwgLy8gbW92ZVNsaWRlXHJcblxyXG5cdFx0bWFrZURvdHM6IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0dmFyIF90aGlzID0gdGhpcyxcclxuXHRcdFx0XHRjb250YWluZXIgPSAkKCcuc2xpZGVyX19jb250YWluZXInKSxcclxuXHRcdFx0XHRkb3RIdG1sID0gJzxsaSBjbGFzcz1cInNsaWRlcl9fZG90c19faXRlbVwiPjxidXR0b24gY2xhc3M9XCJzbGlkZXJfX2RvdHNfX2J0blwiPjwvYnV0dG9uPjwvbGk+JztcclxuXHJcblx0XHRcdGNvbnRhaW5lci5lYWNoKGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0dmFyICR0aGlzID0gJCh0aGlzKSxcclxuXHRcdFx0XHRpdGVtcyA9ICR0aGlzLmZpbmQoJy5zbGlkZXJfX2l0ZW0nKSxcclxuXHRcdFx0XHRkb3RDb250YWluZXIgPSAkdGhpcy5maW5kKCcuc2xpZGVyX19kb3RzX19pdGVtcycpO1xyXG5cclxuXHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGl0ZW1zLnNpemUoKTsgaSsrKSB7XHJcblx0XHRcdFx0XHRkb3RDb250YWluZXIuYXBwZW5kKGRvdEh0bWwpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0X3RoaXMuYWN0aXZlRG90KGRvdENvbnRhaW5lcik7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSwgLy8gbWFrZURvdHNcclxuXHJcblx0XHRhY3RpdmVEb3Q6IGZ1bmN0aW9uKGNvbnRhaW5lcikge1xyXG5cdFx0XHR2YXIgaXRlbXMgPSBjb250YWluZXIuY2xvc2VzdCgnLnNsaWRlcl9fY29udGFpbmVyJykuZmluZCgnLnNsaWRlcl9faXRlbScpO1xyXG5cclxuXHRcdFx0Y29udGFpbmVyXHJcblx0XHRcdFx0LmZpbmQoJy5zbGlkZXJfX2RvdHNfX2l0ZW0nKVxyXG5cdFx0XHRcdC5lcShpdGVtcy5maWx0ZXIoJy5hY3RpdmUnKS5pbmRleCgpKVxyXG5cdFx0XHRcdC5hZGRDbGFzcygnYWN0aXZlJylcclxuXHRcdFx0XHQuc2libGluZ3MoKVxyXG5cdFx0XHRcdC5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcblx0XHR9IC8vIGFjdGl2ZURvdFxyXG5cdH0gLy8gcmV0dXJuXHJcbn0oKSk7XHJcblxyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigkKSB7XHJcblx0aWYgKCQoJy5zbGlkZXJfX2NvbnRhaW5lcicpKSB7XHJcblx0XHRzbGlkZXIuaW5pdCgpO1xyXG5cdH1cclxufSk7IiwiKGZ1bmN0aW9uKCl7XHJcblx0dmFyIHNtb3Roc2Nyb2xsID0ge1xyXG5cdFx0ZG9pdDogZnVuY3Rpb24oKXtcclxuXHRcdFx0dGhpcy5saXN0ZW5lcnMoKTtcclxuXHRcdH0sXHJcblxyXG5cdFx0bGlzdGVuZXJzOiBmdW5jdGlvbigpe1xyXG5cdFx0XHQkKCcjYXJyb3dEb3duJykub24oJ2NsaWNrJywgc21vdGhzY3JvbGwuc2Nyb2xsRG93bik7XHJcblx0XHRcdCQoJyNhcnJvd1VwJykub24oJ2NsaWNrJywgc21vdGhzY3JvbGwuc2Nyb2xsVXApO1xyXG5cdFx0fSxcclxuXHJcblx0XHRzY3JvbGxEb3duOiBmdW5jdGlvbihlKXtcclxuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHR2YXIgaGVhZGVySGVpZ2h0ID0gJCgnLmhlYWRlcicpLmhlaWdodCgpO1xyXG5cdFx0XHQkKCdib2R5JykuYW5pbWF0ZSh7c2Nyb2xsVG9wOiBoZWFkZXJIZWlnaHR9LCAxMDAwKTtcclxuXHRcdH0sXHJcblxyXG5cdFx0c2Nyb2xsVXA6IGZ1bmN0aW9uKGUpe1xyXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdCQoJ2JvZHknKS5hbmltYXRlKHtzY3JvbGxUb3A6IDB9LCAyMDAwKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHNtb3Roc2Nyb2xsLmRvaXQoKTtcclxufSgpKTsiLCIoZnVuY3Rpb24oKXtcclxuXHR2YXIgZm9ybVZhbGlkYXRlID0ge1xyXG5cdFx0ZG9pdDogZnVuY3Rpb24oKXtcclxuXHRcdFx0dGhpcy5saXN0ZW5lcnMoKTtcclxuXHRcdH0sXHJcblxyXG5cdFx0bGlzdGVuZXJzOiBmdW5jdGlvbigpe1xyXG5cdFx0XHQkKCcjbWFpbEZvcm0nKS5vbignc3VibWl0JywgZm9ybVZhbGlkYXRlLm1haWxtZSk7XHJcblx0XHRcdCQoJyNsb2dpbkZvcm0nKS5vbignc3VibWl0JywgZm9ybVZhbGlkYXRlLmxvZ2luVmFsaWQpO1xyXG5cdFx0fSxcclxuXHJcblx0XHRsb2dpblZhbGlkOiBmdW5jdGlvbihlKXtcclxuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHR2YXIgZm9ybSA9ICQodGhpcyk7XHJcblx0XHRcdGlmICggZm9ybVZhbGlkYXRlLnZhbGlkKGZvcm0pID09PSBmYWxzZSApIHJldHVybiBmYWxzZTtcclxuXHJcblx0XHRcdGNvbnNvbGUubG9nKCdjb21lIGluJyk7XHJcblx0XHR9LFxyXG5cclxuXHRcdG1haWxtZTogZnVuY3Rpb24oZSl7XHJcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0dmFyIGZvcm0gPSAkKHRoaXMpO1xyXG5cdFx0XHRpZiAoIGZvcm1WYWxpZGF0ZS52YWxpZChmb3JtKSA9PT0gZmFsc2UgKSByZXR1cm4gZmFsc2U7XHJcblxyXG5cdFx0XHR2YXIgZnJvbSxlbWFpbCxtZXNzYWdlLGRhdGE7XHJcblx0XHRcdHZhciBwYXR0ZXJuID0gL15bYS16MC05Xy1dK0BbYS16MC05LV0rXFwuKFthLXpdezEsNn1cXC4pP1thLXpdezIsNn0kL2k7XHJcblx0XHRcdGZyb209JChcIiNtYWlsTmFtZVwiKS52YWwoKTtcclxuXHRcdFx0ZW1haWw9JChcIiNtYWlsTWFpbFwiKS52YWwoKTtcclxuXHRcdFx0bWVzc2FnZT0kKFwiI21haWxNZXNzYWdlXCIpLnZhbCgpO1xyXG5cdFx0XHRkYXRhID0gZm9ybS5zZXJpYWxpemUoKTtcclxuXHRcdFx0aWYoZW1haWwgIT0gJycpe1xyXG5cdFx0XHRcdGlmKGVtYWlsLnNlYXJjaChwYXR0ZXJuKSA9PSAwKXtcclxuXHRcdFx0XHRcdCQuYWpheCh7XHJcblx0XHRcdFx0XHRcdHVybDogJy9zZW5kJyxcclxuXHRcdFx0XHRcdFx0dHlwZTogJ1BPU1QnLFxyXG5cdFx0XHRcdFx0XHRkYXRhOiBkYXRhXHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0LmRvbmUoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKFwic3VjY2Vzc1wiKTtcclxuXHRcdFx0XHRcdFx0Zm9ybS5zbGlkZVVwKDIwMCk7XHJcblx0XHRcdFx0XHRcdCQoJy53aW5kb3dfX21lbnUnKS5oaWRlKCk7XHJcblx0XHRcdFx0XHRcdCQoJy5mb3JtX19zdWNjZXMnKS5zaG93KCk7XHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0LmZhaWwoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiZXJyb3JcIik7XHJcblx0XHRcdFx0XHRcdGZvcm0uc2xpZGVVcCgyMDApO1xyXG5cdFx0XHRcdFx0XHQkKCcud2luZG93X19tZW51JykuaGlkZSgpO1xyXG5cdFx0XHRcdFx0XHQkKCcuZm9ybV9fZXJyb3InKS5zaG93KCk7XHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHQkKCdpbnB1dCNtYWlsTWFpbCcpLnBhcmVudHMoJy5mb3JtX190ZXh0JykuYWRkQ2xhc3MoJ2Vycm9yJyk7XHJcblx0XHRcdFx0XHQkKCc8c3BhbiBjbGFzcz1cInRvb2x0aXBcIj7QndC10LrQvtGA0YDQtdC60YLRgNGL0LkgZW1haWw8L3NwYW4+JykuYXBwZW5kVG8oJy5lcnJvcicpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHJcblx0XHR2YWxpZDogZnVuY3Rpb24oZm9ybSl7XHJcblx0XHRcdHZhciBpbnB1dHMgPSBmb3JtLmZpbmQoJ2lucHV0LCB0ZXh0YXJlYScpLFxyXG5cdFx0XHRcdGNoZWNrcyA9IGZvcm0uZmluZCgnaW5wdXQ6Y2hlY2tib3gsIGlucHV0OnJhZGlvJyksXHJcblx0XHRcdFx0Y2hlY2tzT2sgPSBmb3JtLmZpbmQoJ2lucHV0OmNoZWNrZWQnKSxcclxuXHRcdFx0XHR2YWxpZCA9IHRydWU7XHJcblxyXG5cdFx0XHQkLmVhY2goaW5wdXRzLCBmdW5jdGlvbihpbmRleCwgdmFsKSB7XHJcblx0XHRcdFx0dmFyIGlucHV0ID0gJCh2YWwpLFxyXG5cdFx0XHRcdHZhbCA9IGlucHV0LnZhbCgpLFxyXG5cdFx0XHRcdGZvcm1Hcm91cCA9IGlucHV0LnBhcmVudHMoJy5mb3JtX190ZXh0LCAuZm9ybV9fdGV4dF9pY29uJyksXHJcblx0XHRcdFx0bGFiZWwgPSBmb3JtR3JvdXAuZmluZCgnbGFiZWwnKS50ZXh0KCkudG9Mb3dlckNhc2UoKSxcclxuXHRcdFx0XHR0ZXh0RXJyb3IgPSAn0JLRiyDQvdC1INCy0LLQtdC70LggJyArIGxhYmVsLFxyXG5cdFx0XHRcdHRvb2x0aXAgPSAkKCc8c3BhbiBjbGFzcz1cInRvb2x0aXBcIj4nICsgdGV4dEVycm9yICsgJzwvc3Bhbj4nKTtcclxuXHJcblx0XHRcdFx0aWYgKHZhbC5sZW5ndGggPT09IDApe1xyXG5cdFx0XHRcdFx0Zm9ybUdyb3VwLmFkZENsYXNzKCdlcnJvcicpO1xyXG5cdFx0XHRcdFx0Zm9ybUdyb3VwLmZpbmQoJy50b29sdGlwJykucmVtb3ZlKCk7XHJcblx0XHRcdFx0XHR0b29sdGlwLmFwcGVuZFRvKGZvcm1Hcm91cCk7XHJcblx0XHRcdFx0XHRpbnB1dC5vbignZm9jdXMnLCBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdFx0XHRmb3JtR3JvdXAuZmluZCgnLnRvb2x0aXAnKS5yZW1vdmUoKTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0aW5wdXQub24oJ2tleWRvd24nLCBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdFx0XHRmb3JtR3JvdXAucmVtb3ZlQ2xhc3MoJ2Vycm9yJyk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdHZhbGlkID0gZmFsc2U7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGZvcm1Hcm91cC5yZW1vdmVDbGFzcygnZXJyb3InKTtcclxuXHRcdFx0XHRcdGZvcm1Hcm91cC5maW5kKCcudG9vbHRpcCcpLnJlbW92ZSgpO1xyXG5cdFx0XHRcdH07XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0dmFyIGNoZWNrR3JvdXAgPSAkKCcuZm9ybV9fY2hlY2tzJyksXHJcblx0XHRcdFx0dG9vbHRpcCA9ICQoJzxzcGFuIGNsYXNzPVwidG9vbHRpcFwiPtCg0L7QsdC+0YLQsNC8INGC0YPRgiDQvdC1INC80LXRgdGC0L48L3NwYW4+Jyk7XHJcblxyXG5cdFx0XHRpZiAoY2hlY2tzLmxlbmd0aCA+IDApIHtcclxuXHJcblx0XHRcdFx0aWYgKGNoZWNrc09rLmxlbmd0aCA8IDIpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdjaGVjayBzb21lb25lJyk7XHJcblx0XHRcdFx0XHRjaGVja0dyb3VwLmZpbmQoJy50b29sdGlwJykucmVtb3ZlKCk7XHJcblx0XHRcdFx0XHR0b29sdGlwLmFwcGVuZFRvKGNoZWNrR3JvdXApO1xyXG5cdFx0XHRcdFx0dmFsaWQgPSBmYWxzZTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Y2hlY2tHcm91cC5maW5kKCcudG9vbHRpcCcpLnJlbW92ZSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gdmFsaWQ7XHJcblx0XHR9XHJcblxyXG5cdH1cclxuXHJcblx0Zm9ybVZhbGlkYXRlLmRvaXQoKTtcclxufSgpKTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
