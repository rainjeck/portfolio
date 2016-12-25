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

if ($('.slider__container')) {
		slider.init();
}
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFkZFBvc3QuanMiLCJibG9nbWVudS5qcyIsImJsdXIuanMiLCJmaXhlZC1ibG9nLW1lbnUuanMiLCJmbGlwLmpzIiwicGFyYWxheC5qcyIsInByZWxvYWRlci5qcyIsInNob3dtZW51LmpzIiwic2xpZGVyLmpzIiwic21vb3Roc2Nyb29sLmpzIiwidmFsaWRhdGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgZG9jID0gZG9jdW1lbnQsXHJcblx0akRvYyA9ICQoZG9jdW1lbnQpO1xyXG5cclxudmFyIHN2ZzRldmVyeWJvZHkgPSAoZnVuY3Rpb24oKXtcclxuXHRzdmc0ZXZlcnlib2R5KCk7XHJcbn0oKSk7IiwiKGZ1bmN0aW9uKCl7XHJcblxyXG5cdHZhciBhZGRQb3N0ID0ge1xyXG5cclxuXHRcdGRvaXQ6IGZ1bmN0aW9uKCl7XHJcblx0XHRcdHRoaXMubGlzdGVuZXJzKCk7XHJcblx0XHR9LFxyXG5cclxuXHRcdGxpc3RlbmVyczogZnVuY3Rpb24oKSB7XHJcblx0XHRcdCQoJyNhZGRQb3N0Jykub24oJ3N1Ym1pdCcsIGFkZFBvc3QuYWRkUG9zdEluQmxvZyk7XHJcblx0XHR9LFxyXG5cclxuXHRcdGFkZFBvc3RJbkJsb2c6IGZ1bmN0aW9uKGUpe1xyXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdHZhciBmb3JtID0gJCh0aGlzKSxcclxuXHRcdFx0XHRpbnB1dHMgPSAkKHRoaXMpLmZpbmQoJ2lucHV0JykudmFsKCk7XHJcblx0XHRcdGlmIChpbnB1dHMubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdHZhciBkYXRhRm9ybSA9ICQodGhpcykuc2VyaWFsaXplQXJyYXkoKTtcclxuXHRcdFx0XHQkLmFqYXgoe1xyXG5cdFx0XHRcdFx0dXJsOiAnL3NhdmVwb3N0JyxcclxuXHRcdFx0XHRcdHR5cGU6ICdQT1NUJyxcclxuXHRcdFx0XHRcdGRhdGFUeXBlOiAnanNvbicsXHJcblx0XHRcdFx0XHRkYXRhOiBkYXRhRm9ybVxyXG5cdFx0XHRcdH0pXHJcblx0XHRcdFx0LmRvbmUoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcInN1Y2Nlc3NcIik7XHJcblx0XHRcdFx0fSlcclxuXHRcdFx0XHQuZmFpbChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiZXJyb3JcIik7XHJcblx0XHRcdFx0fSlcclxuXHRcdFx0XHQuYWx3YXlzKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coXCJjb21wbGV0ZVwiKTtcclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coJ2VtcHR5Jyk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdH1cclxuXHJcblx0YWRkUG9zdC5kb2l0KCk7XHJcblxyXG59KCkpOyIsIi8vINC90LDQstC40LPQsNGG0LjRjyDQsiDQsdC70L7Qs9C1XHJcblxyXG52YXIgY2hlY2tTZWN0aW9uID0gKGZ1bmN0aW9uICgpe1xyXG5cdC8vIHByaXZhdGVcclxuXHR2YXIgZm9sbG93QmxvZ0xpbmsgPSBmdW5jdGlvbihlZGdlKXtcclxuXHRcdCQoJy5ibG9nX19wb3N0JykuZWFjaChmdW5jdGlvbihpLCBlbCl7XHJcblx0XHRcdFx0dmFyICR0aGlzID0gJCh0aGlzKSxcclxuXHRcdFx0XHR0b3BFZGdlID0gJHRoaXMub2Zmc2V0KCkudG9wIC0gZWRnZSxcclxuXHRcdFx0XHRib3R0b21FZGdlID0gdG9wRWRnZSArICR0aGlzLmhlaWdodCgpLFxyXG5cdFx0XHRcdHdTY3JvbGwgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XHJcblxyXG5cdFx0XHRcdGlmICh0b3BFZGdlIDwgd1Njcm9sbCAmJiBib3R0b21FZGdlID4gd1Njcm9sbCkge1xyXG5cdFx0XHRcdFx0dmFyIGN1cnJlbnRJZCA9ICR0aGlzLmRhdGEoJ3NlY3Rpb24nKSxcclxuXHRcdFx0XHRcdFx0cmVxTGluayA9ICQoJy5ibG9nX19uYXZfX2xpbmsnKS5maWx0ZXIoJ1tocmVmID0gXCIjJyArIGN1cnJlbnRJZCArICdcIl0nKTtcclxuXHJcblx0XHRcdFx0XHRyZXFMaW5rLmNsb3Nlc3QoJy5ibG9nX19uYXZfX2l0ZW0nKS5hZGRDbGFzcygnYWN0aXZlJylcclxuXHRcdFx0XHRcdFx0LnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0fTtcclxuXHJcblx0Ly8gcHVibGljXHJcblx0cmV0dXJuIHtcclxuXHRcdGluaXQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgd1dpZHRoID0gJCh3aW5kb3cpLndpZHRoKCk7XHJcblx0XHRcdGlmICggd1dpZHRoID4gNzY4ICkge1xyXG5cdFx0XHRcdGZvbGxvd0Jsb2dMaW5rKDcwKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRmb2xsb3dCbG9nTGluaygyMDApO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG59KCkpO1xyXG5cclxuJCh3aW5kb3cpLnNjcm9sbChmdW5jdGlvbigpe1xyXG5cdGNoZWNrU2VjdGlvbi5pbml0KCk7XHJcbn0pOyIsInZhciBibHVyID0gZnVuY3Rpb24gKCkge1xyXG5cdHZhciB3cmFwcGVyID0gZG9jLnF1ZXJ5U2VsZWN0b3IoJy5ibHVyX193cmFwcGVyJyksXHJcblx0XHRmb3JtID0gZG9jLnF1ZXJ5U2VsZWN0b3IoJy5ibHVyX19mb3JtJyk7XHJcblxyXG5cdHJldHVybiBmdW5jdGlvbigpIHtcclxuXHRcdFx0aWYgKHdyYXBwZXIsIGZvcm0pIHtcclxuXHRcdFx0XHR2YXIgaW1nV2lkdGggPSBkb2MucXVlcnlTZWxlY3RvcignLmJsdXJfX2JhY2tncm91bmQnKS5vZmZzZXRXaWR0aCxcclxuXHRcdFx0XHRcdHBvc0xlZnQgPSAtd3JhcHBlci5vZmZzZXRMZWZ0LFxyXG5cdFx0XHRcdFx0cG9zVG9wID0gLXdyYXBwZXIub2Zmc2V0VG9wLFxyXG5cdFx0XHRcdFx0Ymx1ckNTUyA9IGZvcm0uc3R5bGU7XHJcblxyXG5cdFx0XHRcdGJsdXJDU1MuYmFja2dyb3VuZFNpemUgPSBpbWdXaWR0aCArICdweCAnICsgJ2F1dG8nO1xyXG5cdFx0XHRcdGJsdXJDU1MuYmFja2dyb3VuZFBvc2l0aW9uID0gcG9zTGVmdCArICdweCAnICsgcG9zVG9wICsgJ3B4JztcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG59O1xyXG5cclxudmFyIG1ha2VCbHVyID0gYmx1cigpO1xyXG5cclxubWFrZUJsdXIoKTtcclxuXHJcbndpbmRvdy5vbnJlc2l6ZSA9IGZ1bmN0aW9uICgpIHtcclxuXHRtYWtlQmx1cigpO1xyXG59OyIsInZhciBmaXhlZEJsb2dNZW51ID0gKGZ1bmN0aW9uICgpIHtcclxuXHQvLyBwcml2YXRlXHJcblx0dmFyIG1vdmVNZW51ID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0dmFyIHdXaWR0aCA9ICQod2luZG93KS53aWR0aCgpO1xyXG5cclxuXHRcdGlmICggd1dpZHRoID4gNzY4ICkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyh3V2lkdGgpO1xyXG5cdFx0XHR2YXIgbWVudVdpZHRoID0gJCgnLmJsb2dfX25hdl9faXRlbXMnKS53aWR0aCgpLFxyXG5cdFx0XHR3U2Nyb2xsID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpLFxyXG5cdFx0XHRvZmZzZXQgPSAkKCcuYmxvZ19fbmF2Jykub2Zmc2V0KCksXHJcblx0XHRcdG1lbnUgPSAkKCcuYmxvZ19fbmF2X19pdGVtcycpO1xyXG5cclxuXHRcdFx0aWYgKCAob2Zmc2V0LnRvcCAtIDcwKSA8IHdTY3JvbGwgKSB7XHJcblx0XHRcdFx0bWVudS5hZGRDbGFzcygnYmxvZ19fbmF2X19pdGVtcy1maXhlZCcpO1xyXG5cdFx0XHRcdG1lbnUuY3NzKHt3aWR0aDogbWVudVdpZHRoLCBsZWZ0OiBvZmZzZXQubGVmdCArIDl9KTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRtZW51LnJlbW92ZUNsYXNzKCdibG9nX19uYXZfX2l0ZW1zLWZpeGVkJyk7XHJcblx0XHRcdFx0bWVudS5yZW1vdmVBdHRyKCdzdHlsZScpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fSAvLyBpZlxyXG5cdH07XHJcblxyXG5cdHZhciBzd2lwZU1lbnUgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHQkKCcuanMtbW9iQnV0dG9uJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSl7XHJcblxyXG5cdFx0XHQkKCcuYmxvZ19fbmF2JykudG9nZ2xlQ2xhc3MoJ2pzLXNob3dNZW51Jyk7XHJcblx0XHRcdCQoJy53cmFwcGVyLWJsb2cnKS50b2dnbGVDbGFzcygnanMtbW92ZUxlZnQnKTtcclxuXHJcblx0XHR9KTtcclxuXHR9O1xyXG5cclxuXHQvLyBwdWJsaWNcclxuXHRyZXR1cm4ge1xyXG5cdFx0Zml4ZWRtZW51OiBmdW5jdGlvbigpIHtcclxuXHRcdFx0aWYgKCAkKCcuYmxvZ19fbmF2JykubGVuZ3RoICkge1xyXG5cdFx0XHRcdFx0bW92ZU1lbnUoKTtcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHJcblx0XHRvcGVuTWVudTogZnVuY3Rpb24oKXtcclxuXHRcdFx0aWYgKCAkKCcuYmxvZ19fbmF2JykubGVuZ3RoICkge1xyXG5cdFx0XHRcdHN3aXBlTWVudSgpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxufSgpKTsgLy8gZW5kIG1haW4gZnVuY3Rpb25cclxuXHJcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xyXG5cdCQod2luZG93KS5zY3JvbGwoZnVuY3Rpb24oZXZlbnQpIHtcclxuXHRcdGZpeGVkQmxvZ01lbnUuZml4ZWRtZW51KCk7XHJcblx0fSk7XHJcblx0JCh3aW5kb3cpLnJlc2l6ZShmdW5jdGlvbihldmVudCkge1xyXG5cdFx0Zml4ZWRCbG9nTWVudS5maXhlZG1lbnUoKTtcclxuXHR9KTtcclxuXHRmaXhlZEJsb2dNZW51Lm9wZW5NZW51KCk7XHJcbn0pO1xyXG5cclxuXHJcbiIsInZhciBmbGlwRWZmZWN0ID0gKGZ1bmN0aW9uKCkge1xyXG5cdHZhciBmbGlwQnRuID0gJCgnLmZsaXAtYnRuJyksXHJcblx0XHRmbGlwUmV0dXJuID0gJCgnLmZsaXAtYnRuLXJldHVybicpLFxyXG5cdFx0Y29udGFpbmVyID0gJCgnLmZsaXBjb250YWluZXInKTtcclxuXHJcblx0cmV0dXJuIHtcclxuXHRcdGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0ZmxpcEJ0bi5vbignY2xpY2snLCBmdW5jdGlvbihlKXtcclxuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0Y29udGFpbmVyLnRvZ2dsZUNsYXNzKCdmbGlwJyk7XHJcblx0XHRcdFx0ZmxpcEJ0bi50b2dnbGVDbGFzcygnaGlkZScpO1xyXG5cdFx0XHRcdCQoJy50b29sdGlwJykucmVtb3ZlKCk7XHJcblx0XHRcdFx0JCgnLmZvcm0nKS5maW5kKCcuZXJyb3InKS5yZW1vdmVDbGFzcyhcImVycm9yXCIpO1xyXG5cdFx0XHRcdCQoJ2Zvcm0nKVswXS5yZXNldCgpO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0ZmxpcFJldHVybi5vbignY2xpY2snLCBmdW5jdGlvbihlKXtcclxuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0Y29udGFpbmVyLnRvZ2dsZUNsYXNzKCdmbGlwJyk7XHJcblx0XHRcdFx0ZmxpcEJ0bi50b2dnbGVDbGFzcygnaGlkZScpO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0Ly8g0L/QtdGA0LXQstC+0YDQsNGH0LjQstCw0LXQvCDRhNC+0YDQvNGDINC/0L4g0LrQu9C40LrRgyDQstC90LUg0YTQvtGA0LzRi1xyXG5cdFx0XHRqRG9jLm1vdXNldXAoZnVuY3Rpb24gKGUpIHtcclxuXHRcdFx0XHRpZiAoY29udGFpbmVyLmhhcyhlLnRhcmdldCkubGVuZ3RoID09PSAwKXtcclxuXHRcdFx0XHRcdGNvbnRhaW5lci5yZW1vdmVDbGFzcygnZmxpcCcpO1xyXG5cdFx0XHRcdFx0ZmxpcEJ0bi5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG5cdFx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxufTtcclxufSgpKTtcclxuXHJcbmZsaXBFZmZlY3QuaW5pdCgpOyIsIi8vINGB0L7Qt9C00LDQtdC8INC/0LDRgNCw0LvQsNC60YFcclxudmFyIHBhcmFsbGF4ID0gKGZ1bmN0aW9uICgpIHtcclxuXHQvLyDQsdC10YDQtdC8INGN0LvQtdC80LXQvdGC0YssINC60L7RgtC+0YDRi9C1INCx0YPQtNC10Lwg0LTQstC40LPQsNGC0YxcclxuXHR2YXJcdGJnID0gZG9jLnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX3BpY3R1cmUnKSwgLy8g0LHQtdGA0LXQvCDQsdC70L7QuiDRgSDQutCw0YDRgtC40L3QutC+0LlcclxuXHRcdHVzZXIgPSBkb2MucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fdXNlcicpLCAvLyDQsdC70L7QuiDRgSDRjtC30LXRgNC+0LxcclxuXHRcdHNlY3Rpb25UZXh0ID0gZG9jLnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX2ljb24nKTsgLy8g0LHQu9C+0Log0YEgUG9ydGZvbGlvXHJcblx0Ly8g0LLQvtC30LLRgNCw0YnQsNC10Lwg0YDQtdC30YPQu9GM0YLQsNGCINGE0YPQvdC60YbQuNC4XHJcblx0cmV0dXJuIHtcclxuXHRcdC8vIG1vdmVcclxuXHRcdG1vdmU6IGZ1bmN0aW9uIChibG9jayx3aW5kb3dTY3JvbGwsc3RyYWZlQW1vdW50KSB7XHJcblx0XHRcdC8vIGJsb2NrIC0g0LrQsNC60L7QuSDQsdC70L7QuiDQtNCy0LjQs9Cw0LXQvFxyXG5cdFx0XHQvLyB3aW5kb3dTY3JvbGwgLSDQvdCwINGB0LrQvtC70YzQutC+INC/0YDQvtC70LjRgdGC0LDQu9C4INGB0YLRgNCw0L3QuNGG0YNcclxuXHRcdFx0Ly8gc3RyYWZlQW1vdW50IC0g0LrQvtGN0YTRhNC10YbQuNC10L3Rgiwg0L3QsCDQutC+0YLQvtGA0YvQuSDQsdGD0LTQtdC8INC00LXQu9C40YLRjCDQtNC70Y8g0YHQutC+0YDQvtGB0YLQuFxyXG5cdFx0XHQvLyDQstGL0YfQuNGB0LvRj9C10Lwg0LfQvdCw0YfQtdC90LjQtSDQtNC70Y8g0LTQstC40LbQtdC90LjRjyDQsiDQv9GA0L7RhtC10L3RgtCw0YVcclxuXHRcdFx0dmFyIHN0cmFmZSA9IHdpbmRvd1Njcm9sbCAvIC1zdHJhZmVBbW91bnQgKyAnJSc7XHJcblx0XHRcdC8vINC/0LXRgNC10LrQu9GO0YfQsNC10Lwg0L3QsNCz0YDRg9C30LrRgyDQvdCwINCy0LjQtNC10L7QutCw0YDRgtGDXHJcblx0XHRcdHZhciB0cmFuc2Zvcm1TdHJpbmcgPSAndHJhbnNsYXRlM2QoMCwnICsgc3RyYWZlICsgJywwKSc7XHJcblx0XHRcdC8vINC00L7QsdCw0LLQu9GP0LXQvCDRgdGC0LjQu9GMINC6INC90LDRiNC10LzRgyDQsdC70L7QutGDXHJcblx0XHRcdHZhciBzdHlsZSA9IGJsb2NrLnN0eWxlO1xyXG5cdFx0XHQvLyDQuNGB0L/QvtC70YzQt9GD0LXQvCB0cmFuc2Zvcm0g0LTQu9GPINGB0LzQtdGJ0LXQvdC40Y9cclxuXHRcdFx0Ly8g0LIg0Y3RgtC+0Lwg0YHQu9GD0YfQsNC1INC/0YDQvtGB0YfQtdGCINC+0YHRg9GJ0LXRgdGC0LLQu9GP0LXRgtGB0Y8g0YLQvtC70YzQutC+INC+0LTQuNC9INGA0LDQtywg0YfRgtC+INGB0L3QuNC20LDQtdGCINC90LDQs9GA0YPQt9C60YNcclxuXHRcdFx0c3R5bGUudHJhbnNmb3JtID0gdHJhbnNmb3JtU3RyaW5nO1xyXG5cdFx0XHRzdHlsZS53ZWJraXRUcmFuc2Zvcm0gPSB0cmFuc2Zvcm1TdHJpbmc7XHJcblx0XHRcdC8vINC/0YDQuNGB0LLQsNC40LLQsNC10Lwg0LfQvdCw0YfQtdC90LjRjiAndG9wJyDQv9C10YDQtdC80LXQvdC90YPRjiBzdHJhZmUgLSDRjdGC0L4g0LHRg9C00LXRgiDQv9GA0L7RhtC10L3RgiDRgdC80LXRidC10L3QuNGPXHJcblx0XHRcdHN0eWxlLnRvcCA9IHN0cmFmZTtcclxuXHRcdH0sXHJcblx0XHQvLyBpbml0XHJcblx0XHRpbml0OiBmdW5jdGlvbih3U2Nyb2xsKSB7XHJcblx0XHRcdC8vINC00LLQuNCz0LDQtdC8ICdiZycg0LIg0LfQsNCy0LjRgdC40LzQvtGB0YLQuCDQvtGCICd3U2Nyb2xsJyDQuCDQt9Cw0LTQsNC10Lwg0LrQvtGN0YTRhNC40YbQuNC10YIgKNGH0LXQvCDQvtC9INCx0L7Qu9GM0YjQtSwg0YLQtdC8INC80LXQtNC70LXQvdC90LXQtSDQtNCy0LjQs9Cw0LXRgtGB0Y8pXHJcblx0XHRcdGlmIChiZykge1xyXG5cdFx0XHRcdHRoaXMubW92ZShiZywgd1Njcm9sbCwgNjApO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChzZWN0aW9uVGV4dCkge1xyXG5cdFx0XHRcdHRoaXMubW92ZShzZWN0aW9uVGV4dCwgd1Njcm9sbCwgMzApO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmICh1c2VyKSB7XHJcblx0XHRcdFx0dGhpcy5tb3ZlKHVzZXIsIHdTY3JvbGwsIDUwKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxufSgpKTtcclxuXHJcbndpbmRvdy5vbnNjcm9sbCA9IGZ1bmN0aW9uKCkge1xyXG5cdC8vINGD0LfQvdCw0LXQvCDQvdCwINGB0LrQvtC70YzQutC+INC/0YDQvtC60YDRg9GC0LjQu9C4INGB0YLRgNCw0L3QuNGG0YNcclxuXHR2YXIgd1Njcm9sbCA9IHdpbmRvdy5wYWdlWU9mZnNldDtcclxuXHJcblx0Ly8g0LLRi9C30YvQstCw0LXQvCBwYXJhbGxheCDQv9C+INGB0LrRgNC+0LvQu9GDXHJcblx0cGFyYWxsYXguaW5pdCh3U2Nyb2xsKTtcclxufTsiLCJ2YXIgcHJlbG9hZGVyID0gKGZ1bmN0aW9uKCl7XHJcblxyXG5cdHZhciBwZXJjZW50c1RvdGFsID0gMSxcclxuXHRcdHByZWxvYWRlciA9ICQoJy5wcmVsb2FkZXInKTtcclxuXHJcblx0dmFyIGltZ1BhdGggPSAkKCcqJykubWFwKGZ1bmN0aW9uKGluZGV4LCBlbGVtZW50KSB7XHJcblx0XHR2YXIgYmdyb3VuZCA9ICQoZWxlbWVudCkuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJyksXHJcblx0XHRcdGltZyA9ICQoZWxlbWVudCkuaXMoJ2ltZycpLFxyXG5cdFx0XHRwYXRoID0gJyc7XHJcblxyXG5cdFx0aWYgKGJncm91bmQgIT0gJ25vbmUnKSB7XHJcblx0XHRcdHBhdGggPSBiZ3JvdW5kLnJlcGxhY2UoJ3VybChcIicsICcnKS5yZXBsYWNlKCdcIiknLCAnJyk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGltZykge1xyXG5cdFx0XHRwYXRoID0gJChlbGVtZW50KS5hdHRyKCdzcmMnKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAocGF0aCkgcmV0dXJuIHBhdGhcclxuXHR9KVxyXG5cclxuXHR2YXIgc2V0UGVyY2VudHMgPSBmdW5jdGlvbih0b3RhbCwgY3VycmVudCkge1xyXG5cdFx0dmFyIHBlcmNlbnRzID0gTWF0aC5jZWlsKGN1cnJlbnQgLyB0b3RhbCAqIDEwMCk7XHJcblxyXG5cdFx0JCgnLnByZWxvYWRlcl9fcGVyY2VudHMnKS50ZXh0KHBlcmNlbnRzKTtcclxuXHJcblx0XHRpZiAocGVyY2VudHMgPj0gMTAwKSB7XHJcblx0XHRcdHByZWxvYWRlci5mYWRlT3V0KCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHR2YXIgbG9hZEltYWdlcyA9IGZ1bmN0aW9uKGltYWdlcykge1xyXG5cclxuXHRcdGlmKCFpbWFnZXMubGVuZ3RoKSBwcmVsb2FkZXIuZmFkZU91dCgpO1xyXG5cclxuXHRcdGltYWdlcy5mb3JFYWNoKGZ1bmN0aW9uKGltZywgaSwgaW1hZ2VzKSB7XHJcblx0XHRcdHZhciBmYWtlSW1nID0gJCgnPGltZz4nLCB7XHJcblx0XHRcdFx0YXR0ciA6IHtcclxuXHRcdFx0XHRcdHNyYzogaW1nXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdGZha2VJbWcub24oJ2xvYWQgZXJyb3InLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRzZXRQZXJjZW50cyhpbWFnZXMubGVuZ3RoLCBwZXJjZW50c1RvdGFsKTtcclxuXHRcdFx0XHRwZXJjZW50c1RvdGFsKys7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4ge1xyXG5cdFx0aW5pdDogZnVuY3Rpb24gKCkge1xyXG5cdFx0XHR2YXIgaW1ncyA9IGltZ1BhdGgudG9BcnJheSgpO1xyXG5cdFx0XHRsb2FkSW1hZ2VzKGltZ3MpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcbn0gKCkgKTtcclxuXHJcbiQoZnVuY3Rpb24gKCkge1xyXG5cdHByZWxvYWRlci5pbml0KCk7XHJcbn0pOyIsInZhciBzaG93TWVudSA9KGZ1bmN0aW9uKCkge1xyXG5cdHZhciBtZW51QnRuID0gJCgnI3RvZ2dsZW5hdicpLFxyXG5cdFx0XHRtZW51ID0gXHQkKCcjbmF2aWdhdGUnKSxcclxuXHRcdFx0bWVudUl0ZW0gPSAkKCcubmF2aWdhdGUtdG9wX19saW5rJyksXHJcblx0XHRcdGh0bWwgPSAkKCdodG1sJyksXHJcblx0XHRcdGFuaW1hdGUgPSAkKCcubmF2LWFuaW1hdGUnKTtcclxuXHJcblx0dmFyIG9wZW5NZW51ID0gZnVuY3Rpb24oKXtcclxuXHRcdG1lbnVCdG4ub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG5cdFx0XHRtZW51LnRvZ2dsZSgwLCBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdG1lbnUudG9nZ2xlQ2xhc3MoJ25hdmlnYXRlLXNob3cnKTtcclxuXHRcdFx0XHRtZW51QnRuLnRvZ2dsZUNsYXNzKCdoYW1idXJnZXJfX2ljb24tY2xvc2UnKTtcclxuXHRcdFx0XHRodG1sLnRvZ2dsZUNsYXNzKCdoaWRlU2Nyb2xsJyk7XHJcblx0XHRcdFx0JCgnLm5hdmlnYXRlLXRvcCcpLmFkZENsYXNzKCduYXZpZ2F0ZS10b3AtYW5pbWF0ZScpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdH07XHJcblxyXG5cdHJldHVybiB7XHJcblx0XHRpbml0OiBmdW5jdGlvbigpIHtcclxuXHRcdFx0b3Blbk1lbnUoKTtcclxuXHRcdH1cclxuXHR9XHJcbn0gKCkgKTtcclxuXHJcbnNob3dNZW51LmluaXQoKTsiLCJ2YXIgc2xpZGVyID0gKGZ1bmN0aW9uKCl7XHJcblx0cmV0dXJuIHtcclxuXHRcdGluaXQ6IGZ1bmN0aW9uKCl7XHJcblxyXG5cdFx0XHR2YXIgX3RoaXMgPSB0aGlzLFxyXG5cdFx0XHRcdHNsaWRlckl0ZW1BY3RpdmUgPSAkKCcuc2xpZGVyX19pdGVtJykuZmlyc3QoKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcblxyXG5cdFx0XHQvLyDQtNC+0LHQsNCy0LvRj9C10Lwg0YLQvtGH0LrQuFxyXG5cdFx0XHRfdGhpcy5tYWtlRG90cygpO1xyXG5cclxuXHRcdFx0Ly8g0LbQvNC10Lwg0LrQvdC+0L/QutC4XHJcblx0XHRcdCQoJy5zbGlkZXJfX2J0bicpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpe1xyXG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcblx0XHRcdFx0dmFyICR0aGlzID0gJCh0aGlzKSxcclxuXHRcdFx0XHRpdGVtcyA9ICR0aGlzLmNsb3Nlc3QoJy5zbGlkZXJfX2NvbnRhaW5lcicpLmZpbmQoJy5zbGlkZXJfX2l0ZW0nKSxcclxuXHRcdFx0XHRhY3RpdmVJdGVtID0gaXRlbXMuZmlsdGVyKCcuYWN0aXZlJyksXHJcblx0XHRcdFx0bmV4dEl0ZW0gPSBhY3RpdmVJdGVtLm5leHQoKSxcclxuXHRcdFx0XHRwcmV2SXRlbSA9IGFjdGl2ZUl0ZW0ucHJldigpLFxyXG5cdFx0XHRcdGZpcnN0SXRlbSA9IGl0ZW1zLmZpcnN0KCksXHJcblx0XHRcdFx0bGFzdFNsaWRlID0gaXRlbXMubGFzdDtcclxuXHJcblx0XHRcdFx0aWYoICR0aGlzLmhhc0NsYXNzKCdzbGlkZXJfX2J0bi1uZXh0JykgKXtcclxuXHJcblx0XHRcdFx0XHRpZiAobmV4dEl0ZW0ubGVuZ3RoKSB7XHJcblx0XHRcdFx0XHRcdF90aGlzLm1vdmVTbGlkZShuZXh0SXRlbSk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRfdGhpcy5tb3ZlU2xpZGUoZmlyc3RJdGVtKTtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGlmIChwcmV2SXRlbS5sZW5ndGgpIHtcclxuXHRcdFx0XHRcdFx0X3RoaXMubW92ZVNsaWRlKHByZXZJdGVtKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdF90aGlzLm1vdmVTbGlkZShsYXN0SXRlbSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdC8v0LrQu9C40Log0L/QviDRgtC+0YfQutCw0LxcclxuXHRcdFx0JCgnLnNsaWRlcl9fZG90c19faXRlbXMnKS5vbignY2xpY2snLCAnLnNsaWRlcl9fZG90c19faXRlbScsIGZ1bmN0aW9uKGUpe1xyXG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHR2YXIgJHRoaXMgPSAkKHRoaXMpLFxyXG5cdFx0XHRcdFx0ZG90Q2xpY2sgPSAkdGhpcy5pbmRleCgpLFxyXG5cdFx0XHRcdFx0c2xpZGUgPSAkKCcuc2xpZGVyX19pdGVtJyksXHJcblx0XHRcdFx0XHRhY3RpdmVJdGVtID0gc2xpZGUuZmlsdGVyKCcuYWN0aXZlJyk7XHJcblxyXG5cdFx0XHRcdFx0aWYgKGFjdGl2ZUl0ZW0uaW5kZXgoKSA8IGRvdENsaWNrKSB7XHJcblx0XHRcdFx0XHRcdF90aGlzLm1vdmVTbGlkZShzbGlkZS5lcShkb3RDbGljaykpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0X3RoaXMubW92ZVNsaWRlKHNsaWRlLmVxKGRvdENsaWNrKSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdH0pXHJcblx0XHR9LFxyXG5cclxuXHRcdC8vINC00LLQuNCz0LDQtdC8INGB0LvQsNC50LTRi1xyXG5cdFx0bW92ZVNsaWRlOiBmdW5jdGlvbihzbGlkZSkge1xyXG5cclxuXHRcdFx0XHR2YXIgX3RoaXMgPSB0aGlzLFxyXG5cdFx0XHRcdFx0Y29udGFpbmVyID0gc2xpZGUuY2xvc2VzdCgnLnNsaWRlcl9fY29udGFpbmVyJyksXHJcblx0XHRcdFx0XHRpdGVtcyA9IGNvbnRhaW5lci5maW5kKCcuc2xpZGVyX19pdGVtJyksXHJcblx0XHRcdFx0XHRhY3RpdmUgPSBpdGVtcy5maWx0ZXIoJy5hY3RpdmUnKTtcclxuXHJcblx0XHRcdFx0aXRlbXMuYWRkQ2xhc3MoJ2hpZGVTbGlkZScpLnJlbW92ZUNsYXNzKCdhY3RpdmUgc2hvd1NsaWRlJyk7XHJcblx0XHRcdFx0c2xpZGUucmVtb3ZlQ2xhc3MoJ2hpZGVTbGlkZScpLmFkZENsYXNzKCdhY3RpdmUgc2hvd1NsaWRlJyk7XHJcblxyXG5cdFx0XHRcdF90aGlzLmFjdGl2ZURvdChjb250YWluZXIuZmluZCgnLnNsaWRlcl9fZG90c19faXRlbXMnKSk7XHJcblx0XHR9LCAvLyBtb3ZlU2xpZGVcclxuXHJcblx0XHRtYWtlRG90czogZnVuY3Rpb24gKCkge1xyXG5cdFx0XHR2YXIgX3RoaXMgPSB0aGlzLFxyXG5cdFx0XHRcdGNvbnRhaW5lciA9ICQoJy5zbGlkZXJfX2NvbnRhaW5lcicpLFxyXG5cdFx0XHRcdGRvdEh0bWwgPSAnPGxpIGNsYXNzPVwic2xpZGVyX19kb3RzX19pdGVtXCI+PGJ1dHRvbiBjbGFzcz1cInNsaWRlcl9fZG90c19fYnRuXCI+PC9idXR0b24+PC9saT4nO1xyXG5cclxuXHRcdFx0Y29udGFpbmVyLmVhY2goZnVuY3Rpb24oKXtcclxuXHRcdFx0XHR2YXIgJHRoaXMgPSAkKHRoaXMpLFxyXG5cdFx0XHRcdGl0ZW1zID0gJHRoaXMuZmluZCgnLnNsaWRlcl9faXRlbScpLFxyXG5cdFx0XHRcdGRvdENvbnRhaW5lciA9ICR0aGlzLmZpbmQoJy5zbGlkZXJfX2RvdHNfX2l0ZW1zJyk7XHJcblxyXG5cdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgaXRlbXMuc2l6ZSgpOyBpKyspIHtcclxuXHRcdFx0XHRcdGRvdENvbnRhaW5lci5hcHBlbmQoZG90SHRtbCk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRfdGhpcy5hY3RpdmVEb3QoZG90Q29udGFpbmVyKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9LCAvLyBtYWtlRG90c1xyXG5cclxuXHRcdGFjdGl2ZURvdDogZnVuY3Rpb24oY29udGFpbmVyKSB7XHJcblx0XHRcdHZhciBpdGVtcyA9IGNvbnRhaW5lci5jbG9zZXN0KCcuc2xpZGVyX19jb250YWluZXInKS5maW5kKCcuc2xpZGVyX19pdGVtJyk7XHJcblxyXG5cdFx0XHRjb250YWluZXJcclxuXHRcdFx0XHQuZmluZCgnLnNsaWRlcl9fZG90c19faXRlbScpXHJcblx0XHRcdFx0LmVxKGl0ZW1zLmZpbHRlcignLmFjdGl2ZScpLmluZGV4KCkpXHJcblx0XHRcdFx0LmFkZENsYXNzKCdhY3RpdmUnKVxyXG5cdFx0XHRcdC5zaWJsaW5ncygpXHJcblx0XHRcdFx0LnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuXHRcdH0gLy8gYWN0aXZlRG90XHJcblx0fSAvLyByZXR1cm5cclxufSgpKTtcclxuXHJcbmlmICgkKCcuc2xpZGVyX19jb250YWluZXInKSkge1xyXG5cdFx0c2xpZGVyLmluaXQoKTtcclxufSIsIihmdW5jdGlvbigpe1xyXG5cdHZhciBzbW90aHNjcm9sbCA9IHtcclxuXHRcdGRvaXQ6IGZ1bmN0aW9uKCl7XHJcblx0XHRcdHRoaXMubGlzdGVuZXJzKCk7XHJcblx0XHR9LFxyXG5cclxuXHRcdGxpc3RlbmVyczogZnVuY3Rpb24oKXtcclxuXHRcdFx0JCgnI2Fycm93RG93bicpLm9uKCdjbGljaycsIHNtb3Roc2Nyb2xsLnNjcm9sbERvd24pO1xyXG5cdFx0XHQkKCcjYXJyb3dVcCcpLm9uKCdjbGljaycsIHNtb3Roc2Nyb2xsLnNjcm9sbFVwKTtcclxuXHRcdH0sXHJcblxyXG5cdFx0c2Nyb2xsRG93bjogZnVuY3Rpb24oZSl7XHJcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0dmFyIGhlYWRlckhlaWdodCA9ICQoJy5oZWFkZXInKS5oZWlnaHQoKTtcclxuXHRcdFx0JCgnYm9keScpLmFuaW1hdGUoe3Njcm9sbFRvcDogaGVhZGVySGVpZ2h0fSwgMTAwMCk7XHJcblx0XHR9LFxyXG5cclxuXHRcdHNjcm9sbFVwOiBmdW5jdGlvbihlKXtcclxuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHQkKCdib2R5JykuYW5pbWF0ZSh7c2Nyb2xsVG9wOiAwfSwgMjAwMCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRzbW90aHNjcm9sbC5kb2l0KCk7XHJcbn0oKSk7IiwiKGZ1bmN0aW9uKCl7XHJcblx0dmFyIGZvcm1WYWxpZGF0ZSA9IHtcclxuXHRcdGRvaXQ6IGZ1bmN0aW9uKCl7XHJcblx0XHRcdHRoaXMubGlzdGVuZXJzKCk7XHJcblx0XHR9LFxyXG5cclxuXHRcdGxpc3RlbmVyczogZnVuY3Rpb24oKXtcclxuXHRcdFx0JCgnI21haWxGb3JtJykub24oJ3N1Ym1pdCcsIGZvcm1WYWxpZGF0ZS5tYWlsbWUpO1xyXG5cdFx0XHQkKCcjbG9naW5Gb3JtJykub24oJ3N1Ym1pdCcsIGZvcm1WYWxpZGF0ZS5sb2dpblZhbGlkKTtcclxuXHRcdH0sXHJcblxyXG5cdFx0bG9naW5WYWxpZDogZnVuY3Rpb24oZSl7XHJcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0dmFyIGZvcm0gPSAkKHRoaXMpO1xyXG5cdFx0XHRpZiAoIGZvcm1WYWxpZGF0ZS52YWxpZChmb3JtKSA9PT0gZmFsc2UgKSByZXR1cm4gZmFsc2U7XHJcblxyXG5cdFx0XHRjb25zb2xlLmxvZygnY29tZSBpbicpO1xyXG5cdFx0fSxcclxuXHJcblx0XHRtYWlsbWU6IGZ1bmN0aW9uKGUpe1xyXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdHZhciBmb3JtID0gJCh0aGlzKTtcclxuXHRcdFx0aWYgKCBmb3JtVmFsaWRhdGUudmFsaWQoZm9ybSkgPT09IGZhbHNlICkgcmV0dXJuIGZhbHNlO1xyXG5cclxuXHRcdFx0dmFyIGZyb20sZW1haWwsbWVzc2FnZSxkYXRhO1xyXG5cdFx0XHR2YXIgcGF0dGVybiA9IC9eW2EtejAtOV8tXStAW2EtejAtOS1dK1xcLihbYS16XXsxLDZ9XFwuKT9bYS16XXsyLDZ9JC9pO1xyXG5cdFx0XHRmcm9tPSQoXCIjbWFpbE5hbWVcIikudmFsKCk7XHJcblx0XHRcdGVtYWlsPSQoXCIjbWFpbE1haWxcIikudmFsKCk7XHJcblx0XHRcdG1lc3NhZ2U9JChcIiNtYWlsTWVzc2FnZVwiKS52YWwoKTtcclxuXHRcdFx0ZGF0YSA9IGZvcm0uc2VyaWFsaXplKCk7XHJcblx0XHRcdGlmKGVtYWlsICE9ICcnKXtcclxuXHRcdFx0XHRpZihlbWFpbC5zZWFyY2gocGF0dGVybikgPT0gMCl7XHJcblx0XHRcdFx0XHQkLmFqYXgoe1xyXG5cdFx0XHRcdFx0XHR1cmw6ICcvc2VuZCcsXHJcblx0XHRcdFx0XHRcdHR5cGU6ICdQT1NUJyxcclxuXHRcdFx0XHRcdFx0ZGF0YTogZGF0YVxyXG5cdFx0XHRcdFx0fSlcclxuXHRcdFx0XHRcdC5kb25lKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhcInN1Y2Nlc3NcIik7XHJcblx0XHRcdFx0XHRcdGZvcm0uc2xpZGVVcCgyMDApO1xyXG5cdFx0XHRcdFx0XHQkKCcud2luZG93X19tZW51JykuaGlkZSgpO1xyXG5cdFx0XHRcdFx0XHQkKCcuZm9ybV9fc3VjY2VzJykuc2hvdygpO1xyXG5cdFx0XHRcdFx0fSlcclxuXHRcdFx0XHRcdC5mYWlsKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhcImVycm9yXCIpO1xyXG5cdFx0XHRcdFx0XHRmb3JtLnNsaWRlVXAoMjAwKTtcclxuXHRcdFx0XHRcdFx0JCgnLndpbmRvd19fbWVudScpLmhpZGUoKTtcclxuXHRcdFx0XHRcdFx0JCgnLmZvcm1fX2Vycm9yJykuc2hvdygpO1xyXG5cdFx0XHRcdFx0fSlcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0JCgnaW5wdXQjbWFpbE1haWwnKS5wYXJlbnRzKCcuZm9ybV9fdGV4dCcpLmFkZENsYXNzKCdlcnJvcicpO1xyXG5cdFx0XHRcdFx0JCgnPHNwYW4gY2xhc3M9XCJ0b29sdGlwXCI+0J3QtdC60L7RgNGA0LXQutGC0YDRi9C5IGVtYWlsPC9zcGFuPicpLmFwcGVuZFRvKCcuZXJyb3InKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblxyXG5cdFx0dmFsaWQ6IGZ1bmN0aW9uKGZvcm0pe1xyXG5cdFx0XHR2YXIgaW5wdXRzID0gZm9ybS5maW5kKCdpbnB1dCwgdGV4dGFyZWEnKSxcclxuXHRcdFx0XHRjaGVja3MgPSBmb3JtLmZpbmQoJ2lucHV0OmNoZWNrYm94LCBpbnB1dDpyYWRpbycpLFxyXG5cdFx0XHRcdGNoZWNrc09rID0gZm9ybS5maW5kKCdpbnB1dDpjaGVja2VkJyksXHJcblx0XHRcdFx0dmFsaWQgPSB0cnVlO1xyXG5cclxuXHRcdFx0JC5lYWNoKGlucHV0cywgZnVuY3Rpb24oaW5kZXgsIHZhbCkge1xyXG5cdFx0XHRcdHZhciBpbnB1dCA9ICQodmFsKSxcclxuXHRcdFx0XHR2YWwgPSBpbnB1dC52YWwoKSxcclxuXHRcdFx0XHRmb3JtR3JvdXAgPSBpbnB1dC5wYXJlbnRzKCcuZm9ybV9fdGV4dCwgLmZvcm1fX3RleHRfaWNvbicpLFxyXG5cdFx0XHRcdGxhYmVsID0gZm9ybUdyb3VwLmZpbmQoJ2xhYmVsJykudGV4dCgpLnRvTG93ZXJDYXNlKCksXHJcblx0XHRcdFx0dGV4dEVycm9yID0gJ9CS0Ysg0L3QtSDQstCy0LXQu9C4ICcgKyBsYWJlbCxcclxuXHRcdFx0XHR0b29sdGlwID0gJCgnPHNwYW4gY2xhc3M9XCJ0b29sdGlwXCI+JyArIHRleHRFcnJvciArICc8L3NwYW4+Jyk7XHJcblxyXG5cdFx0XHRcdGlmICh2YWwubGVuZ3RoID09PSAwKXtcclxuXHRcdFx0XHRcdGZvcm1Hcm91cC5hZGRDbGFzcygnZXJyb3InKTtcclxuXHRcdFx0XHRcdGZvcm1Hcm91cC5maW5kKCcudG9vbHRpcCcpLnJlbW92ZSgpO1xyXG5cdFx0XHRcdFx0dG9vbHRpcC5hcHBlbmRUbyhmb3JtR3JvdXApO1xyXG5cdFx0XHRcdFx0aW5wdXQub24oJ2ZvY3VzJywgZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRcdFx0Zm9ybUdyb3VwLmZpbmQoJy50b29sdGlwJykucmVtb3ZlKCk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdGlucHV0Lm9uKCdrZXlkb3duJywgZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRcdFx0Zm9ybUdyb3VwLnJlbW92ZUNsYXNzKCdlcnJvcicpO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHR2YWxpZCA9IGZhbHNlO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRmb3JtR3JvdXAucmVtb3ZlQ2xhc3MoJ2Vycm9yJyk7XHJcblx0XHRcdFx0XHRmb3JtR3JvdXAuZmluZCgnLnRvb2x0aXAnKS5yZW1vdmUoKTtcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdHZhciBjaGVja0dyb3VwID0gJCgnLmZvcm1fX2NoZWNrcycpLFxyXG5cdFx0XHRcdHRvb2x0aXAgPSAkKCc8c3BhbiBjbGFzcz1cInRvb2x0aXBcIj7QoNC+0LHQvtGC0LDQvCDRgtGD0YIg0L3QtSDQvNC10YHRgtC+PC9zcGFuPicpO1xyXG5cclxuXHRcdFx0aWYgKGNoZWNrcy5sZW5ndGggPiAwKSB7XHJcblxyXG5cdFx0XHRcdGlmIChjaGVja3NPay5sZW5ndGggPCAyKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnY2hlY2sgc29tZW9uZScpO1xyXG5cdFx0XHRcdFx0Y2hlY2tHcm91cC5maW5kKCcudG9vbHRpcCcpLnJlbW92ZSgpO1xyXG5cdFx0XHRcdFx0dG9vbHRpcC5hcHBlbmRUbyhjaGVja0dyb3VwKTtcclxuXHRcdFx0XHRcdHZhbGlkID0gZmFsc2U7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGNoZWNrR3JvdXAuZmluZCgnLnRvb2x0aXAnKS5yZW1vdmUoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIHZhbGlkO1xyXG5cdFx0fVxyXG5cclxuXHR9XHJcblxyXG5cdGZvcm1WYWxpZGF0ZS5kb2l0KCk7XHJcbn0oKSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
