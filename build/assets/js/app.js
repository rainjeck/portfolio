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
			$('#deletePost').on('submit', addPost.deletePost);
			addPost.showPosts();
			$('#admDoneBtn').on('click', addPost.closeDoneWin);
		},

		closeDoneWin: function (e) {
			e.preventDefault();
			var $this = $(this),
				winWrap = $this.closest('.admpanel__done__wrapper');
			winWrap.hide();
			addPost.showPosts();
		},

		showPosts: function(){
			$.get('/showpost', function(data) {
				$('#posts').empty().append(data);
			});
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
					data: dataForm,
					success: function () {
						var wWidth = $(window).width(),
							wHeight = $(window).height(),
							wScroll = $(window).scrollTop();

						$('.admpanel__done__text').text('Пост добавлен');
						$('.admpanel__done__wrapper').css({width: wWidth, height: wHeight, top: wScroll}).fadeIn();
						form[0].reset();
					}
				});

			} else {
				console.log('empty');
			}

		}, // add post

		deletePost: function (e) {
			e.preventDefault();
			var form = $(this),
				inputs = $(this).find('input').val();

			if (inputs.length > 0) {
				var dataForm = $(this).serializeArray();
				$.ajax({
					url: '/delete',
					type: 'POST',
					dataType: 'json',
					data: dataForm,
					success: function (data) {
						var wWidth = $(window).width(),
							wHeight = $(window).height(),
							wScroll = $(window).scrollTop();

						$('.admpanel__done__text').text('Пост удален');
						$('.admpanel__done__wrapper').css({width: wWidth, height: wHeight, top: wScroll}).fadeIn();
						form[0].reset();
						console.log('delete');
					}
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFkZFBvc3QuanMiLCJibG9nbWVudS5qcyIsImJsdXIuanMiLCJmaXhlZC1ibG9nLW1lbnUuanMiLCJmbGlwLmpzIiwicGFyYWxheC5qcyIsInByZWxvYWRlci5qcyIsInNob3dtZW51LmpzIiwic2xpZGVyLmpzIiwic21vb3Roc2Nyb29sLmpzIiwidmFsaWRhdGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgZG9jID0gZG9jdW1lbnQsXHJcblx0akRvYyA9ICQoZG9jdW1lbnQpO1xyXG5cclxudmFyIHN2ZzRldmVyeWJvZHkgPSAoZnVuY3Rpb24oKXtcclxuXHRzdmc0ZXZlcnlib2R5KCk7XHJcbn0oKSk7IiwiKGZ1bmN0aW9uKCl7XHJcblxyXG5cdHZhciBhZGRQb3N0ID0ge1xyXG5cclxuXHRcdGRvaXQ6IGZ1bmN0aW9uKCl7XHJcblx0XHRcdHRoaXMubGlzdGVuZXJzKCk7XHJcblx0XHR9LFxyXG5cclxuXHRcdGxpc3RlbmVyczogZnVuY3Rpb24oKSB7XHJcblx0XHRcdCQoJyNhZGRQb3N0Jykub24oJ3N1Ym1pdCcsIGFkZFBvc3QuYWRkUG9zdEluQmxvZyk7XHJcblx0XHRcdCQoJyNkZWxldGVQb3N0Jykub24oJ3N1Ym1pdCcsIGFkZFBvc3QuZGVsZXRlUG9zdCk7XHJcblx0XHRcdGFkZFBvc3Quc2hvd1Bvc3RzKCk7XHJcblx0XHRcdCQoJyNhZG1Eb25lQnRuJykub24oJ2NsaWNrJywgYWRkUG9zdC5jbG9zZURvbmVXaW4pO1xyXG5cdFx0fSxcclxuXHJcblx0XHRjbG9zZURvbmVXaW46IGZ1bmN0aW9uIChlKSB7XHJcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0dmFyICR0aGlzID0gJCh0aGlzKSxcclxuXHRcdFx0XHR3aW5XcmFwID0gJHRoaXMuY2xvc2VzdCgnLmFkbXBhbmVsX19kb25lX193cmFwcGVyJyk7XHJcblx0XHRcdHdpbldyYXAuaGlkZSgpO1xyXG5cdFx0XHRhZGRQb3N0LnNob3dQb3N0cygpO1xyXG5cdFx0fSxcclxuXHJcblx0XHRzaG93UG9zdHM6IGZ1bmN0aW9uKCl7XHJcblx0XHRcdCQuZ2V0KCcvc2hvd3Bvc3QnLCBmdW5jdGlvbihkYXRhKSB7XHJcblx0XHRcdFx0JCgnI3Bvc3RzJykuZW1wdHkoKS5hcHBlbmQoZGF0YSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSxcclxuXHJcblx0XHRhZGRQb3N0SW5CbG9nOiBmdW5jdGlvbihlKXtcclxuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHR2YXIgZm9ybSA9ICQodGhpcyksXHJcblx0XHRcdFx0aW5wdXRzID0gJCh0aGlzKS5maW5kKCdpbnB1dCcpLnZhbCgpO1xyXG5cdFx0XHRpZiAoaW5wdXRzLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHR2YXIgZGF0YUZvcm0gPSAkKHRoaXMpLnNlcmlhbGl6ZUFycmF5KCk7XHJcblx0XHRcdFx0JC5hamF4KHtcclxuXHRcdFx0XHRcdHVybDogJy9zYXZlcG9zdCcsXHJcblx0XHRcdFx0XHR0eXBlOiAnUE9TVCcsXHJcblx0XHRcdFx0XHRkYXRhVHlwZTogJ2pzb24nLFxyXG5cdFx0XHRcdFx0ZGF0YTogZGF0YUZvcm0sXHJcblx0XHRcdFx0XHRzdWNjZXNzOiBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0XHRcdHZhciB3V2lkdGggPSAkKHdpbmRvdykud2lkdGgoKSxcclxuXHRcdFx0XHRcdFx0XHR3SGVpZ2h0ID0gJCh3aW5kb3cpLmhlaWdodCgpLFxyXG5cdFx0XHRcdFx0XHRcdHdTY3JvbGwgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XHJcblxyXG5cdFx0XHRcdFx0XHQkKCcuYWRtcGFuZWxfX2RvbmVfX3RleHQnKS50ZXh0KCfQn9C+0YHRgiDQtNC+0LHQsNCy0LvQtdC9Jyk7XHJcblx0XHRcdFx0XHRcdCQoJy5hZG1wYW5lbF9fZG9uZV9fd3JhcHBlcicpLmNzcyh7d2lkdGg6IHdXaWR0aCwgaGVpZ2h0OiB3SGVpZ2h0LCB0b3A6IHdTY3JvbGx9KS5mYWRlSW4oKTtcclxuXHRcdFx0XHRcdFx0Zm9ybVswXS5yZXNldCgpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZygnZW1wdHknKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH0sIC8vIGFkZCBwb3N0XHJcblxyXG5cdFx0ZGVsZXRlUG9zdDogZnVuY3Rpb24gKGUpIHtcclxuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHR2YXIgZm9ybSA9ICQodGhpcyksXHJcblx0XHRcdFx0aW5wdXRzID0gJCh0aGlzKS5maW5kKCdpbnB1dCcpLnZhbCgpO1xyXG5cclxuXHRcdFx0aWYgKGlucHV0cy5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0dmFyIGRhdGFGb3JtID0gJCh0aGlzKS5zZXJpYWxpemVBcnJheSgpO1xyXG5cdFx0XHRcdCQuYWpheCh7XHJcblx0XHRcdFx0XHR1cmw6ICcvZGVsZXRlJyxcclxuXHRcdFx0XHRcdHR5cGU6ICdQT1NUJyxcclxuXHRcdFx0XHRcdGRhdGFUeXBlOiAnanNvbicsXHJcblx0XHRcdFx0XHRkYXRhOiBkYXRhRm9ybSxcclxuXHRcdFx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XHJcblx0XHRcdFx0XHRcdHZhciB3V2lkdGggPSAkKHdpbmRvdykud2lkdGgoKSxcclxuXHRcdFx0XHRcdFx0XHR3SGVpZ2h0ID0gJCh3aW5kb3cpLmhlaWdodCgpLFxyXG5cdFx0XHRcdFx0XHRcdHdTY3JvbGwgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XHJcblxyXG5cdFx0XHRcdFx0XHQkKCcuYWRtcGFuZWxfX2RvbmVfX3RleHQnKS50ZXh0KCfQn9C+0YHRgiDRg9C00LDQu9C10L0nKTtcclxuXHRcdFx0XHRcdFx0JCgnLmFkbXBhbmVsX19kb25lX193cmFwcGVyJykuY3NzKHt3aWR0aDogd1dpZHRoLCBoZWlnaHQ6IHdIZWlnaHQsIHRvcDogd1Njcm9sbH0pLmZhZGVJbigpO1xyXG5cdFx0XHRcdFx0XHRmb3JtWzBdLnJlc2V0KCk7XHJcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKCdkZWxldGUnKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZygnZW1wdHknKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHR9XHJcblxyXG5cdGFkZFBvc3QuZG9pdCgpO1xyXG5cclxufSgpKTsiLCIvLyDQvdCw0LLQuNCz0LDRhtC40Y8g0LIg0LHQu9C+0LPQtVxyXG5cclxudmFyIGNoZWNrU2VjdGlvbiA9IChmdW5jdGlvbiAoKXtcclxuXHQvLyBwcml2YXRlXHJcblx0dmFyIGZvbGxvd0Jsb2dMaW5rID0gZnVuY3Rpb24oZWRnZSl7XHJcblx0XHQkKCcuYmxvZ19fcG9zdCcpLmVhY2goZnVuY3Rpb24oaSwgZWwpe1xyXG5cdFx0XHRcdHZhciAkdGhpcyA9ICQodGhpcyksXHJcblx0XHRcdFx0dG9wRWRnZSA9ICR0aGlzLm9mZnNldCgpLnRvcCAtIGVkZ2UsXHJcblx0XHRcdFx0Ym90dG9tRWRnZSA9IHRvcEVkZ2UgKyAkdGhpcy5oZWlnaHQoKSxcclxuXHRcdFx0XHR3U2Nyb2xsID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xyXG5cclxuXHRcdFx0XHRpZiAodG9wRWRnZSA8IHdTY3JvbGwgJiYgYm90dG9tRWRnZSA+IHdTY3JvbGwpIHtcclxuXHRcdFx0XHRcdHZhciBjdXJyZW50SWQgPSAkdGhpcy5kYXRhKCdzZWN0aW9uJyksXHJcblx0XHRcdFx0XHRcdHJlcUxpbmsgPSAkKCcuYmxvZ19fbmF2X19saW5rJykuZmlsdGVyKCdbaHJlZiA9IFwiIycgKyBjdXJyZW50SWQgKyAnXCJdJyk7XHJcblxyXG5cdFx0XHRcdFx0cmVxTGluay5jbG9zZXN0KCcuYmxvZ19fbmF2X19pdGVtJykuYWRkQ2xhc3MoJ2FjdGl2ZScpXHJcblx0XHRcdFx0XHRcdC5zaWJsaW5ncygpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdH07XHJcblxyXG5cdC8vIHB1YmxpY1xyXG5cdHJldHVybiB7XHJcblx0XHRpbml0OiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIHdXaWR0aCA9ICQod2luZG93KS53aWR0aCgpO1xyXG5cdFx0XHRpZiAoIHdXaWR0aCA+IDc2OCApIHtcclxuXHRcdFx0XHRmb2xsb3dCbG9nTGluayg3MCk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Zm9sbG93QmxvZ0xpbmsoMjAwKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxufSgpKTtcclxuXHJcbiQod2luZG93KS5zY3JvbGwoZnVuY3Rpb24oKXtcclxuXHRjaGVja1NlY3Rpb24uaW5pdCgpO1xyXG59KTsiLCJ2YXIgYmx1ciA9IGZ1bmN0aW9uICgpIHtcclxuXHR2YXIgd3JhcHBlciA9IGRvYy5xdWVyeVNlbGVjdG9yKCcuYmx1cl9fd3JhcHBlcicpLFxyXG5cdFx0Zm9ybSA9IGRvYy5xdWVyeVNlbGVjdG9yKCcuYmx1cl9fZm9ybScpO1xyXG5cclxuXHRyZXR1cm4gZnVuY3Rpb24oKSB7XHJcblx0XHRcdGlmICh3cmFwcGVyLCBmb3JtKSB7XHJcblx0XHRcdFx0dmFyIGltZ1dpZHRoID0gZG9jLnF1ZXJ5U2VsZWN0b3IoJy5ibHVyX19iYWNrZ3JvdW5kJykub2Zmc2V0V2lkdGgsXHJcblx0XHRcdFx0XHRwb3NMZWZ0ID0gLXdyYXBwZXIub2Zmc2V0TGVmdCxcclxuXHRcdFx0XHRcdHBvc1RvcCA9IC13cmFwcGVyLm9mZnNldFRvcCxcclxuXHRcdFx0XHRcdGJsdXJDU1MgPSBmb3JtLnN0eWxlO1xyXG5cclxuXHRcdFx0XHRibHVyQ1NTLmJhY2tncm91bmRTaXplID0gaW1nV2lkdGggKyAncHggJyArICdhdXRvJztcclxuXHRcdFx0XHRibHVyQ1NTLmJhY2tncm91bmRQb3NpdGlvbiA9IHBvc0xlZnQgKyAncHggJyArIHBvc1RvcCArICdweCc7XHJcblx0XHRcdH1cclxuXHRcdH1cclxufTtcclxuXHJcbnZhciBtYWtlQmx1ciA9IGJsdXIoKTtcclxuXHJcbm1ha2VCbHVyKCk7XHJcblxyXG53aW5kb3cub25yZXNpemUgPSBmdW5jdGlvbiAoKSB7XHJcblx0bWFrZUJsdXIoKTtcclxufTsiLCJ2YXIgZml4ZWRCbG9nTWVudSA9IChmdW5jdGlvbiAoKSB7XHJcblx0Ly8gcHJpdmF0ZVxyXG5cdHZhciBtb3ZlTWVudSA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdHZhciB3V2lkdGggPSAkKHdpbmRvdykud2lkdGgoKTtcclxuXHJcblx0XHRpZiAoIHdXaWR0aCA+IDc2OCApIHtcclxuXHRcdFx0Y29uc29sZS5sb2cod1dpZHRoKTtcclxuXHRcdFx0dmFyIG1lbnVXaWR0aCA9ICQoJy5ibG9nX19uYXZfX2l0ZW1zJykud2lkdGgoKSxcclxuXHRcdFx0d1Njcm9sbCA9ICQod2luZG93KS5zY3JvbGxUb3AoKSxcclxuXHRcdFx0b2Zmc2V0ID0gJCgnLmJsb2dfX25hdicpLm9mZnNldCgpLFxyXG5cdFx0XHRtZW51ID0gJCgnLmJsb2dfX25hdl9faXRlbXMnKTtcclxuXHJcblx0XHRcdGlmICggKG9mZnNldC50b3AgLSA3MCkgPCB3U2Nyb2xsICkge1xyXG5cdFx0XHRcdG1lbnUuYWRkQ2xhc3MoJ2Jsb2dfX25hdl9faXRlbXMtZml4ZWQnKTtcclxuXHRcdFx0XHRtZW51LmNzcyh7d2lkdGg6IG1lbnVXaWR0aCwgbGVmdDogb2Zmc2V0LmxlZnQgKyA5fSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0bWVudS5yZW1vdmVDbGFzcygnYmxvZ19fbmF2X19pdGVtcy1maXhlZCcpO1xyXG5cdFx0XHRcdG1lbnUucmVtb3ZlQXR0cignc3R5bGUnKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH0gLy8gaWZcclxuXHR9O1xyXG5cclxuXHR2YXIgc3dpcGVNZW51ID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0JCgnLmpzLW1vYkJ1dHRvbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpe1xyXG5cclxuXHRcdFx0JCgnLmJsb2dfX25hdicpLnRvZ2dsZUNsYXNzKCdqcy1zaG93TWVudScpO1xyXG5cdFx0XHQkKCcud3JhcHBlci1ibG9nJykudG9nZ2xlQ2xhc3MoJ2pzLW1vdmVMZWZ0Jyk7XHJcblxyXG5cdFx0fSk7XHJcblx0fTtcclxuXHJcblx0Ly8gcHVibGljXHJcblx0cmV0dXJuIHtcclxuXHRcdGZpeGVkbWVudTogZnVuY3Rpb24oKSB7XHJcblx0XHRcdGlmICggJCgnLmJsb2dfX25hdicpLmxlbmd0aCApIHtcclxuXHRcdFx0XHRcdG1vdmVNZW51KCk7XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblxyXG5cdFx0b3Blbk1lbnU6IGZ1bmN0aW9uKCl7XHJcblx0XHRcdGlmICggJCgnLmJsb2dfX25hdicpLmxlbmd0aCApIHtcclxuXHRcdFx0XHRzd2lwZU1lbnUoKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcbn0oKSk7IC8vIGVuZCBtYWluIGZ1bmN0aW9uXHJcblxyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcclxuXHQkKHdpbmRvdykuc2Nyb2xsKGZ1bmN0aW9uKGV2ZW50KSB7XHJcblx0XHRmaXhlZEJsb2dNZW51LmZpeGVkbWVudSgpO1xyXG5cdH0pO1xyXG5cdCQod2luZG93KS5yZXNpemUoZnVuY3Rpb24oZXZlbnQpIHtcclxuXHRcdGZpeGVkQmxvZ01lbnUuZml4ZWRtZW51KCk7XHJcblx0fSk7XHJcblx0Zml4ZWRCbG9nTWVudS5vcGVuTWVudSgpO1xyXG59KTtcclxuXHJcblxyXG4iLCJ2YXIgZmxpcEVmZmVjdCA9IChmdW5jdGlvbigpIHtcclxuXHR2YXIgZmxpcEJ0biA9ICQoJy5mbGlwLWJ0bicpLFxyXG5cdFx0ZmxpcFJldHVybiA9ICQoJy5mbGlwLWJ0bi1yZXR1cm4nKSxcclxuXHRcdGNvbnRhaW5lciA9ICQoJy5mbGlwY29udGFpbmVyJyk7XHJcblxyXG5cdHJldHVybiB7XHJcblx0XHRpbml0OiBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGZsaXBCdG4ub24oJ2NsaWNrJywgZnVuY3Rpb24oZSl7XHJcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRcdGNvbnRhaW5lci50b2dnbGVDbGFzcygnZmxpcCcpO1xyXG5cdFx0XHRcdGZsaXBCdG4udG9nZ2xlQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdFx0XHQkKCcudG9vbHRpcCcpLnJlbW92ZSgpO1xyXG5cdFx0XHRcdCQoJy5mb3JtJykuZmluZCgnLmVycm9yJykucmVtb3ZlQ2xhc3MoXCJlcnJvclwiKTtcclxuXHRcdFx0XHQkKCdmb3JtJylbMF0ucmVzZXQoKTtcclxuXHRcdFx0fSk7XHJcblx0XHRcdGZsaXBSZXR1cm4ub24oJ2NsaWNrJywgZnVuY3Rpb24oZSl7XHJcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRcdGNvbnRhaW5lci50b2dnbGVDbGFzcygnZmxpcCcpO1xyXG5cdFx0XHRcdGZsaXBCdG4udG9nZ2xlQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdFx0fSk7XHJcblx0XHRcdC8vINC/0LXRgNC10LLQvtGA0LDRh9C40LLQsNC10Lwg0YTQvtGA0LzRgyDQv9C+INC60LvQuNC60YMg0LLQvdC1INGE0L7RgNC80YtcclxuXHRcdFx0akRvYy5tb3VzZXVwKGZ1bmN0aW9uIChlKSB7XHJcblx0XHRcdFx0aWYgKGNvbnRhaW5lci5oYXMoZS50YXJnZXQpLmxlbmd0aCA9PT0gMCl7XHJcblx0XHRcdFx0XHRjb250YWluZXIucmVtb3ZlQ2xhc3MoJ2ZsaXAnKTtcclxuXHRcdFx0XHRcdGZsaXBCdG4ucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcbn07XHJcbn0oKSk7XHJcblxyXG5mbGlwRWZmZWN0LmluaXQoKTsiLCIvLyDRgdC+0LfQtNCw0LXQvCDQv9Cw0YDQsNC70LDQutGBXHJcbnZhciBwYXJhbGxheCA9IChmdW5jdGlvbiAoKSB7XHJcblx0Ly8g0LHQtdGA0LXQvCDRjdC70LXQvNC10L3RgtGLLCDQutC+0YLQvtGA0YvQtSDQsdGD0LTQtdC8INC00LLQuNCz0LDRgtGMXHJcblx0dmFyXHRiZyA9IGRvYy5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19waWN0dXJlJyksIC8vINCx0LXRgNC10Lwg0LHQu9C+0Log0YEg0LrQsNGA0YLQuNC90LrQvtC5XHJcblx0XHR1c2VyID0gZG9jLnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX3VzZXInKSwgLy8g0LHQu9C+0Log0YEg0Y7Qt9C10YDQvtC8XHJcblx0XHRzZWN0aW9uVGV4dCA9IGRvYy5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19pY29uJyk7IC8vINCx0LvQvtC6INGBIFBvcnRmb2xpb1xyXG5cdC8vINCy0L7Qt9Cy0YDQsNGJ0LDQtdC8INGA0LXQt9GD0LvRjNGC0LDRgiDRhNGD0L3QutGG0LjQuFxyXG5cdHJldHVybiB7XHJcblx0XHQvLyBtb3ZlXHJcblx0XHRtb3ZlOiBmdW5jdGlvbiAoYmxvY2ssd2luZG93U2Nyb2xsLHN0cmFmZUFtb3VudCkge1xyXG5cdFx0XHQvLyBibG9jayAtINC60LDQutC+0Lkg0LHQu9C+0Log0LTQstC40LPQsNC10LxcclxuXHRcdFx0Ly8gd2luZG93U2Nyb2xsIC0g0L3QsCDRgdC60L7Qu9GM0LrQviDQv9GA0L7Qu9C40YHRgtCw0LvQuCDRgdGC0YDQsNC90LjRhtGDXHJcblx0XHRcdC8vIHN0cmFmZUFtb3VudCAtINC60L7RjdGE0YTQtdGG0LjQtdC90YIsINC90LAg0LrQvtGC0L7RgNGL0Lkg0LHRg9C00LXQvCDQtNC10LvQuNGC0Ywg0LTQu9GPINGB0LrQvtGA0L7RgdGC0LhcclxuXHRcdFx0Ly8g0LLRi9GH0LjRgdC70Y/QtdC8INC30L3QsNGH0LXQvdC40LUg0LTQu9GPINC00LLQuNC20LXQvdC40Y8g0LIg0L/RgNC+0YbQtdC90YLQsNGFXHJcblx0XHRcdHZhciBzdHJhZmUgPSB3aW5kb3dTY3JvbGwgLyAtc3RyYWZlQW1vdW50ICsgJyUnO1xyXG5cdFx0XHQvLyDQv9C10YDQtdC60LvRjtGH0LDQtdC8INC90LDQs9GA0YPQt9C60YMg0L3QsCDQstC40LTQtdC+0LrQsNGA0YLRg1xyXG5cdFx0XHR2YXIgdHJhbnNmb3JtU3RyaW5nID0gJ3RyYW5zbGF0ZTNkKDAsJyArIHN0cmFmZSArICcsMCknO1xyXG5cdFx0XHQvLyDQtNC+0LHQsNCy0LvRj9C10Lwg0YHRgtC40LvRjCDQuiDQvdCw0YjQtdC80YMg0LHQu9C+0LrRg1xyXG5cdFx0XHR2YXIgc3R5bGUgPSBibG9jay5zdHlsZTtcclxuXHRcdFx0Ly8g0LjRgdC/0L7Qu9GM0LfRg9C10LwgdHJhbnNmb3JtINC00LvRjyDRgdC80LXRidC10L3QuNGPXHJcblx0XHRcdC8vINCyINGN0YLQvtC8INGB0LvRg9GH0LDQtSDQv9GA0L7RgdGH0LXRgiDQvtGB0YPRidC10YHRgtCy0LvRj9C10YLRgdGPINGC0L7Qu9GM0LrQviDQvtC00LjQvSDRgNCw0LcsINGH0YLQviDRgdC90LjQttCw0LXRgiDQvdCw0LPRgNGD0LfQutGDXHJcblx0XHRcdHN0eWxlLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVN0cmluZztcclxuXHRcdFx0c3R5bGUud2Via2l0VHJhbnNmb3JtID0gdHJhbnNmb3JtU3RyaW5nO1xyXG5cdFx0XHQvLyDQv9GA0LjRgdCy0LDQuNCy0LDQtdC8INC30L3QsNGH0LXQvdC40Y4gJ3RvcCcg0L/QtdGA0LXQvNC10L3QvdGD0Y4gc3RyYWZlIC0g0Y3RgtC+INCx0YPQtNC10YIg0L/RgNC+0YbQtdC90YIg0YHQvNC10YnQtdC90LjRj1xyXG5cdFx0XHRzdHlsZS50b3AgPSBzdHJhZmU7XHJcblx0XHR9LFxyXG5cdFx0Ly8gaW5pdFxyXG5cdFx0aW5pdDogZnVuY3Rpb24od1Njcm9sbCkge1xyXG5cdFx0XHQvLyDQtNCy0LjQs9Cw0LXQvCAnYmcnINCyINC30LDQstC40YHQuNC80L7RgdGC0Lgg0L7RgiAnd1Njcm9sbCcg0Lgg0LfQsNC00LDQtdC8INC60L7RjdGE0YTQuNGG0LjQtdGCICjRh9C10Lwg0L7QvSDQsdC+0LvRjNGI0LUsINGC0LXQvCDQvNC10LTQu9C10L3QvdC10LUg0LTQstC40LPQsNC10YLRgdGPKVxyXG5cdFx0XHRpZiAoYmcpIHtcclxuXHRcdFx0XHR0aGlzLm1vdmUoYmcsIHdTY3JvbGwsIDYwKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoc2VjdGlvblRleHQpIHtcclxuXHRcdFx0XHR0aGlzLm1vdmUoc2VjdGlvblRleHQsIHdTY3JvbGwsIDMwKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAodXNlcikge1xyXG5cdFx0XHRcdHRoaXMubW92ZSh1c2VyLCB3U2Nyb2xsLCA1MCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcbn0oKSk7XHJcblxyXG53aW5kb3cub25zY3JvbGwgPSBmdW5jdGlvbigpIHtcclxuXHQvLyDRg9C30L3QsNC10Lwg0L3QsCDRgdC60L7Qu9GM0LrQviDQv9GA0L7QutGA0YPRgtC40LvQuCDRgdGC0YDQsNC90LjRhtGDXHJcblx0dmFyIHdTY3JvbGwgPSB3aW5kb3cucGFnZVlPZmZzZXQ7XHJcblxyXG5cdC8vINCy0YvQt9GL0LLQsNC10LwgcGFyYWxsYXgg0L/QviDRgdC60YDQvtC70LvRg1xyXG5cdHBhcmFsbGF4LmluaXQod1Njcm9sbCk7XHJcbn07IiwidmFyIHByZWxvYWRlciA9IChmdW5jdGlvbigpe1xyXG5cclxuXHR2YXIgcGVyY2VudHNUb3RhbCA9IDEsXHJcblx0XHRwcmVsb2FkZXIgPSAkKCcucHJlbG9hZGVyJyk7XHJcblxyXG5cdHZhciBpbWdQYXRoID0gJCgnKicpLm1hcChmdW5jdGlvbihpbmRleCwgZWxlbWVudCkge1xyXG5cdFx0dmFyIGJncm91bmQgPSAkKGVsZW1lbnQpLmNzcygnYmFja2dyb3VuZC1pbWFnZScpLFxyXG5cdFx0XHRpbWcgPSAkKGVsZW1lbnQpLmlzKCdpbWcnKSxcclxuXHRcdFx0cGF0aCA9ICcnO1xyXG5cclxuXHRcdGlmIChiZ3JvdW5kICE9ICdub25lJykge1xyXG5cdFx0XHRwYXRoID0gYmdyb3VuZC5yZXBsYWNlKCd1cmwoXCInLCAnJykucmVwbGFjZSgnXCIpJywgJycpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChpbWcpIHtcclxuXHRcdFx0cGF0aCA9ICQoZWxlbWVudCkuYXR0cignc3JjJyk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHBhdGgpIHJldHVybiBwYXRoXHJcblx0fSlcclxuXHJcblx0dmFyIHNldFBlcmNlbnRzID0gZnVuY3Rpb24odG90YWwsIGN1cnJlbnQpIHtcclxuXHRcdHZhciBwZXJjZW50cyA9IE1hdGguY2VpbChjdXJyZW50IC8gdG90YWwgKiAxMDApO1xyXG5cclxuXHRcdCQoJy5wcmVsb2FkZXJfX3BlcmNlbnRzJykudGV4dChwZXJjZW50cyk7XHJcblxyXG5cdFx0aWYgKHBlcmNlbnRzID49IDEwMCkge1xyXG5cdFx0XHRwcmVsb2FkZXIuZmFkZU91dCgpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0dmFyIGxvYWRJbWFnZXMgPSBmdW5jdGlvbihpbWFnZXMpIHtcclxuXHJcblx0XHRpZighaW1hZ2VzLmxlbmd0aCkgcHJlbG9hZGVyLmZhZGVPdXQoKTtcclxuXHJcblx0XHRpbWFnZXMuZm9yRWFjaChmdW5jdGlvbihpbWcsIGksIGltYWdlcykge1xyXG5cdFx0XHR2YXIgZmFrZUltZyA9ICQoJzxpbWc+Jywge1xyXG5cdFx0XHRcdGF0dHIgOiB7XHJcblx0XHRcdFx0XHRzcmM6IGltZ1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRmYWtlSW1nLm9uKCdsb2FkIGVycm9yJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0c2V0UGVyY2VudHMoaW1hZ2VzLmxlbmd0aCwgcGVyY2VudHNUb3RhbCk7XHJcblx0XHRcdFx0cGVyY2VudHNUb3RhbCsrO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIHtcclxuXHRcdGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0dmFyIGltZ3MgPSBpbWdQYXRoLnRvQXJyYXkoKTtcclxuXHRcdFx0bG9hZEltYWdlcyhpbWdzKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG59ICgpICk7XHJcblxyXG4kKGZ1bmN0aW9uICgpIHtcclxuXHRwcmVsb2FkZXIuaW5pdCgpO1xyXG59KTsiLCJ2YXIgc2hvd01lbnUgPShmdW5jdGlvbigpIHtcclxuXHR2YXIgbWVudUJ0biA9ICQoJyN0b2dnbGVuYXYnKSxcclxuXHRcdFx0bWVudSA9IFx0JCgnI25hdmlnYXRlJyksXHJcblx0XHRcdG1lbnVJdGVtID0gJCgnLm5hdmlnYXRlLXRvcF9fbGluaycpLFxyXG5cdFx0XHRodG1sID0gJCgnaHRtbCcpLFxyXG5cdFx0XHRhbmltYXRlID0gJCgnLm5hdi1hbmltYXRlJyk7XHJcblxyXG5cdHZhciBvcGVuTWVudSA9IGZ1bmN0aW9uKCl7XHJcblx0XHRtZW51QnRuLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0bWVudS50b2dnbGUoMCwgZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRtZW51LnRvZ2dsZUNsYXNzKCduYXZpZ2F0ZS1zaG93Jyk7XHJcblx0XHRcdFx0bWVudUJ0bi50b2dnbGVDbGFzcygnaGFtYnVyZ2VyX19pY29uLWNsb3NlJyk7XHJcblx0XHRcdFx0aHRtbC50b2dnbGVDbGFzcygnaGlkZVNjcm9sbCcpO1xyXG5cdFx0XHRcdCQoJy5uYXZpZ2F0ZS10b3AnKS5hZGRDbGFzcygnbmF2aWdhdGUtdG9wLWFuaW1hdGUnKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9O1xyXG5cclxuXHRyZXR1cm4ge1xyXG5cdFx0aW5pdDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdG9wZW5NZW51KCk7XHJcblx0XHR9XHJcblx0fVxyXG59ICgpICk7XHJcblxyXG5zaG93TWVudS5pbml0KCk7IiwidmFyIHNsaWRlciA9IChmdW5jdGlvbigpe1xyXG5cdHJldHVybiB7XHJcblx0XHRpbml0OiBmdW5jdGlvbigpe1xyXG5cclxuXHRcdFx0dmFyIF90aGlzID0gdGhpcyxcclxuXHRcdFx0XHRzbGlkZXJJdGVtQWN0aXZlID0gJCgnLnNsaWRlcl9faXRlbScpLmZpcnN0KCkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cclxuXHRcdFx0Ly8g0LTQvtCx0LDQstC70Y/QtdC8INGC0L7Rh9C60LhcclxuXHRcdFx0X3RoaXMubWFrZURvdHMoKTtcclxuXHJcblx0XHRcdC8vINC20LzQtdC8INC60L3QvtC/0LrQuFxyXG5cdFx0XHQkKCcuc2xpZGVyX19idG4nKS5vbignY2xpY2snLCBmdW5jdGlvbihlKXtcclxuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG5cdFx0XHRcdHZhciAkdGhpcyA9ICQodGhpcyksXHJcblx0XHRcdFx0aXRlbXMgPSAkdGhpcy5jbG9zZXN0KCcuc2xpZGVyX19jb250YWluZXInKS5maW5kKCcuc2xpZGVyX19pdGVtJyksXHJcblx0XHRcdFx0YWN0aXZlSXRlbSA9IGl0ZW1zLmZpbHRlcignLmFjdGl2ZScpLFxyXG5cdFx0XHRcdG5leHRJdGVtID0gYWN0aXZlSXRlbS5uZXh0KCksXHJcblx0XHRcdFx0cHJldkl0ZW0gPSBhY3RpdmVJdGVtLnByZXYoKSxcclxuXHRcdFx0XHRmaXJzdEl0ZW0gPSBpdGVtcy5maXJzdCgpLFxyXG5cdFx0XHRcdGxhc3RTbGlkZSA9IGl0ZW1zLmxhc3Q7XHJcblxyXG5cdFx0XHRcdGlmKCAkdGhpcy5oYXNDbGFzcygnc2xpZGVyX19idG4tbmV4dCcpICl7XHJcblxyXG5cdFx0XHRcdFx0aWYgKG5leHRJdGVtLmxlbmd0aCkge1xyXG5cdFx0XHRcdFx0XHRfdGhpcy5tb3ZlU2xpZGUobmV4dEl0ZW0pO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0X3RoaXMubW92ZVNsaWRlKGZpcnN0SXRlbSk7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRpZiAocHJldkl0ZW0ubGVuZ3RoKSB7XHJcblx0XHRcdFx0XHRcdF90aGlzLm1vdmVTbGlkZShwcmV2SXRlbSk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRfdGhpcy5tb3ZlU2xpZGUobGFzdEl0ZW0pO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHQvL9C60LvQuNC6INC/0L4g0YLQvtGH0LrQsNC8XHJcblx0XHRcdCQoJy5zbGlkZXJfX2RvdHNfX2l0ZW1zJykub24oJ2NsaWNrJywgJy5zbGlkZXJfX2RvdHNfX2l0ZW0nLCBmdW5jdGlvbihlKXtcclxuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0dmFyICR0aGlzID0gJCh0aGlzKSxcclxuXHRcdFx0XHRcdGRvdENsaWNrID0gJHRoaXMuaW5kZXgoKSxcclxuXHRcdFx0XHRcdHNsaWRlID0gJCgnLnNsaWRlcl9faXRlbScpLFxyXG5cdFx0XHRcdFx0YWN0aXZlSXRlbSA9IHNsaWRlLmZpbHRlcignLmFjdGl2ZScpO1xyXG5cclxuXHRcdFx0XHRcdGlmIChhY3RpdmVJdGVtLmluZGV4KCkgPCBkb3RDbGljaykge1xyXG5cdFx0XHRcdFx0XHRfdGhpcy5tb3ZlU2xpZGUoc2xpZGUuZXEoZG90Q2xpY2spKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdF90aGlzLm1vdmVTbGlkZShzbGlkZS5lcShkb3RDbGljaykpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHR9KVxyXG5cdFx0fSxcclxuXHJcblx0XHQvLyDQtNCy0LjQs9Cw0LXQvCDRgdC70LDQudC00YtcclxuXHRcdG1vdmVTbGlkZTogZnVuY3Rpb24oc2xpZGUpIHtcclxuXHJcblx0XHRcdFx0dmFyIF90aGlzID0gdGhpcyxcclxuXHRcdFx0XHRcdGNvbnRhaW5lciA9IHNsaWRlLmNsb3Nlc3QoJy5zbGlkZXJfX2NvbnRhaW5lcicpLFxyXG5cdFx0XHRcdFx0aXRlbXMgPSBjb250YWluZXIuZmluZCgnLnNsaWRlcl9faXRlbScpLFxyXG5cdFx0XHRcdFx0YWN0aXZlID0gaXRlbXMuZmlsdGVyKCcuYWN0aXZlJyk7XHJcblxyXG5cdFx0XHRcdGl0ZW1zLmFkZENsYXNzKCdoaWRlU2xpZGUnKS5yZW1vdmVDbGFzcygnYWN0aXZlIHNob3dTbGlkZScpO1xyXG5cdFx0XHRcdHNsaWRlLnJlbW92ZUNsYXNzKCdoaWRlU2xpZGUnKS5hZGRDbGFzcygnYWN0aXZlIHNob3dTbGlkZScpO1xyXG5cclxuXHRcdFx0XHRfdGhpcy5hY3RpdmVEb3QoY29udGFpbmVyLmZpbmQoJy5zbGlkZXJfX2RvdHNfX2l0ZW1zJykpO1xyXG5cdFx0fSwgLy8gbW92ZVNsaWRlXHJcblxyXG5cdFx0bWFrZURvdHM6IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0dmFyIF90aGlzID0gdGhpcyxcclxuXHRcdFx0XHRjb250YWluZXIgPSAkKCcuc2xpZGVyX19jb250YWluZXInKSxcclxuXHRcdFx0XHRkb3RIdG1sID0gJzxsaSBjbGFzcz1cInNsaWRlcl9fZG90c19faXRlbVwiPjxidXR0b24gY2xhc3M9XCJzbGlkZXJfX2RvdHNfX2J0blwiPjwvYnV0dG9uPjwvbGk+JztcclxuXHJcblx0XHRcdGNvbnRhaW5lci5lYWNoKGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0dmFyICR0aGlzID0gJCh0aGlzKSxcclxuXHRcdFx0XHRpdGVtcyA9ICR0aGlzLmZpbmQoJy5zbGlkZXJfX2l0ZW0nKSxcclxuXHRcdFx0XHRkb3RDb250YWluZXIgPSAkdGhpcy5maW5kKCcuc2xpZGVyX19kb3RzX19pdGVtcycpO1xyXG5cclxuXHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGl0ZW1zLnNpemUoKTsgaSsrKSB7XHJcblx0XHRcdFx0XHRkb3RDb250YWluZXIuYXBwZW5kKGRvdEh0bWwpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0X3RoaXMuYWN0aXZlRG90KGRvdENvbnRhaW5lcik7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSwgLy8gbWFrZURvdHNcclxuXHJcblx0XHRhY3RpdmVEb3Q6IGZ1bmN0aW9uKGNvbnRhaW5lcikge1xyXG5cdFx0XHR2YXIgaXRlbXMgPSBjb250YWluZXIuY2xvc2VzdCgnLnNsaWRlcl9fY29udGFpbmVyJykuZmluZCgnLnNsaWRlcl9faXRlbScpO1xyXG5cclxuXHRcdFx0Y29udGFpbmVyXHJcblx0XHRcdFx0LmZpbmQoJy5zbGlkZXJfX2RvdHNfX2l0ZW0nKVxyXG5cdFx0XHRcdC5lcShpdGVtcy5maWx0ZXIoJy5hY3RpdmUnKS5pbmRleCgpKVxyXG5cdFx0XHRcdC5hZGRDbGFzcygnYWN0aXZlJylcclxuXHRcdFx0XHQuc2libGluZ3MoKVxyXG5cdFx0XHRcdC5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcblx0XHR9IC8vIGFjdGl2ZURvdFxyXG5cdH0gLy8gcmV0dXJuXHJcbn0oKSk7XHJcblxyXG5pZiAoJCgnLnNsaWRlcl9fY29udGFpbmVyJykpIHtcclxuXHRcdHNsaWRlci5pbml0KCk7XHJcbn0iLCIoZnVuY3Rpb24oKXtcclxuXHR2YXIgc21vdGhzY3JvbGwgPSB7XHJcblx0XHRkb2l0OiBmdW5jdGlvbigpe1xyXG5cdFx0XHR0aGlzLmxpc3RlbmVycygpO1xyXG5cdFx0fSxcclxuXHJcblx0XHRsaXN0ZW5lcnM6IGZ1bmN0aW9uKCl7XHJcblx0XHRcdCQoJyNhcnJvd0Rvd24nKS5vbignY2xpY2snLCBzbW90aHNjcm9sbC5zY3JvbGxEb3duKTtcclxuXHRcdFx0JCgnI2Fycm93VXAnKS5vbignY2xpY2snLCBzbW90aHNjcm9sbC5zY3JvbGxVcCk7XHJcblx0XHR9LFxyXG5cclxuXHRcdHNjcm9sbERvd246IGZ1bmN0aW9uKGUpe1xyXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdHZhciBoZWFkZXJIZWlnaHQgPSAkKCcuaGVhZGVyJykuaGVpZ2h0KCk7XHJcblx0XHRcdCQoJ2JvZHknKS5hbmltYXRlKHtzY3JvbGxUb3A6IGhlYWRlckhlaWdodH0sIDEwMDApO1xyXG5cdFx0fSxcclxuXHJcblx0XHRzY3JvbGxVcDogZnVuY3Rpb24oZSl7XHJcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0JCgnYm9keScpLmFuaW1hdGUoe3Njcm9sbFRvcDogMH0sIDIwMDApO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0c21vdGhzY3JvbGwuZG9pdCgpO1xyXG59KCkpOyIsIihmdW5jdGlvbigpe1xyXG5cdHZhciBmb3JtVmFsaWRhdGUgPSB7XHJcblx0XHRkb2l0OiBmdW5jdGlvbigpe1xyXG5cdFx0XHR0aGlzLmxpc3RlbmVycygpO1xyXG5cdFx0fSxcclxuXHJcblx0XHRsaXN0ZW5lcnM6IGZ1bmN0aW9uKCl7XHJcblx0XHRcdCQoJyNtYWlsRm9ybScpLm9uKCdzdWJtaXQnLCBmb3JtVmFsaWRhdGUubWFpbG1lKTtcclxuXHRcdFx0JCgnI2xvZ2luRm9ybScpLm9uKCdzdWJtaXQnLCBmb3JtVmFsaWRhdGUubG9naW5WYWxpZCk7XHJcblx0XHR9LFxyXG5cclxuXHRcdGxvZ2luVmFsaWQ6IGZ1bmN0aW9uKGUpe1xyXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdHZhciBmb3JtID0gJCh0aGlzKTtcclxuXHRcdFx0aWYgKCBmb3JtVmFsaWRhdGUudmFsaWQoZm9ybSkgPT09IGZhbHNlICkgcmV0dXJuIGZhbHNlO1xyXG5cclxuXHRcdFx0Y29uc29sZS5sb2coJ2NvbWUgaW4nKTtcclxuXHRcdH0sXHJcblxyXG5cdFx0bWFpbG1lOiBmdW5jdGlvbihlKXtcclxuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHR2YXIgZm9ybSA9ICQodGhpcyk7XHJcblx0XHRcdGlmICggZm9ybVZhbGlkYXRlLnZhbGlkKGZvcm0pID09PSBmYWxzZSApIHJldHVybiBmYWxzZTtcclxuXHJcblx0XHRcdHZhciBmcm9tLGVtYWlsLG1lc3NhZ2UsZGF0YTtcclxuXHRcdFx0dmFyIHBhdHRlcm4gPSAvXlthLXowLTlfLV0rQFthLXowLTktXStcXC4oW2Etel17MSw2fVxcLik/W2Etel17Miw2fSQvaTtcclxuXHRcdFx0ZnJvbT0kKFwiI21haWxOYW1lXCIpLnZhbCgpO1xyXG5cdFx0XHRlbWFpbD0kKFwiI21haWxNYWlsXCIpLnZhbCgpO1xyXG5cdFx0XHRtZXNzYWdlPSQoXCIjbWFpbE1lc3NhZ2VcIikudmFsKCk7XHJcblx0XHRcdGRhdGEgPSBmb3JtLnNlcmlhbGl6ZSgpO1xyXG5cdFx0XHRpZihlbWFpbCAhPSAnJyl7XHJcblx0XHRcdFx0aWYoZW1haWwuc2VhcmNoKHBhdHRlcm4pID09IDApe1xyXG5cdFx0XHRcdFx0JC5hamF4KHtcclxuXHRcdFx0XHRcdFx0dXJsOiAnL3NlbmQnLFxyXG5cdFx0XHRcdFx0XHR0eXBlOiAnUE9TVCcsXHJcblx0XHRcdFx0XHRcdGRhdGE6IGRhdGFcclxuXHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0XHQuZG9uZShmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coXCJzdWNjZXNzXCIpO1xyXG5cdFx0XHRcdFx0XHRmb3JtLnNsaWRlVXAoMjAwKTtcclxuXHRcdFx0XHRcdFx0JCgnLndpbmRvd19fbWVudScpLmhpZGUoKTtcclxuXHRcdFx0XHRcdFx0JCgnLmZvcm1fX3N1Y2NlcycpLnNob3coKTtcclxuXHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0XHQuZmFpbChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coXCJlcnJvclwiKTtcclxuXHRcdFx0XHRcdFx0Zm9ybS5zbGlkZVVwKDIwMCk7XHJcblx0XHRcdFx0XHRcdCQoJy53aW5kb3dfX21lbnUnKS5oaWRlKCk7XHJcblx0XHRcdFx0XHRcdCQoJy5mb3JtX19lcnJvcicpLnNob3coKTtcclxuXHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdCQoJ2lucHV0I21haWxNYWlsJykucGFyZW50cygnLmZvcm1fX3RleHQnKS5hZGRDbGFzcygnZXJyb3InKTtcclxuXHRcdFx0XHRcdCQoJzxzcGFuIGNsYXNzPVwidG9vbHRpcFwiPtCd0LXQutC+0YDRgNC10LrRgtGA0YvQuSBlbWFpbDwvc3Bhbj4nKS5hcHBlbmRUbygnLmVycm9yJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cclxuXHRcdHZhbGlkOiBmdW5jdGlvbihmb3JtKXtcclxuXHRcdFx0dmFyIGlucHV0cyA9IGZvcm0uZmluZCgnaW5wdXQsIHRleHRhcmVhJyksXHJcblx0XHRcdFx0Y2hlY2tzID0gZm9ybS5maW5kKCdpbnB1dDpjaGVja2JveCwgaW5wdXQ6cmFkaW8nKSxcclxuXHRcdFx0XHRjaGVja3NPayA9IGZvcm0uZmluZCgnaW5wdXQ6Y2hlY2tlZCcpLFxyXG5cdFx0XHRcdHZhbGlkID0gdHJ1ZTtcclxuXHJcblx0XHRcdCQuZWFjaChpbnB1dHMsIGZ1bmN0aW9uKGluZGV4LCB2YWwpIHtcclxuXHRcdFx0XHR2YXIgaW5wdXQgPSAkKHZhbCksXHJcblx0XHRcdFx0dmFsID0gaW5wdXQudmFsKCksXHJcblx0XHRcdFx0Zm9ybUdyb3VwID0gaW5wdXQucGFyZW50cygnLmZvcm1fX3RleHQsIC5mb3JtX190ZXh0X2ljb24nKSxcclxuXHRcdFx0XHRsYWJlbCA9IGZvcm1Hcm91cC5maW5kKCdsYWJlbCcpLnRleHQoKS50b0xvd2VyQ2FzZSgpLFxyXG5cdFx0XHRcdHRleHRFcnJvciA9ICfQktGLINC90LUg0LLQstC10LvQuCAnICsgbGFiZWwsXHJcblx0XHRcdFx0dG9vbHRpcCA9ICQoJzxzcGFuIGNsYXNzPVwidG9vbHRpcFwiPicgKyB0ZXh0RXJyb3IgKyAnPC9zcGFuPicpO1xyXG5cclxuXHRcdFx0XHRpZiAodmFsLmxlbmd0aCA9PT0gMCl7XHJcblx0XHRcdFx0XHRmb3JtR3JvdXAuYWRkQ2xhc3MoJ2Vycm9yJyk7XHJcblx0XHRcdFx0XHRmb3JtR3JvdXAuZmluZCgnLnRvb2x0aXAnKS5yZW1vdmUoKTtcclxuXHRcdFx0XHRcdHRvb2x0aXAuYXBwZW5kVG8oZm9ybUdyb3VwKTtcclxuXHRcdFx0XHRcdGlucHV0Lm9uKCdmb2N1cycsIGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0XHRcdGZvcm1Hcm91cC5maW5kKCcudG9vbHRpcCcpLnJlbW92ZSgpO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRpbnB1dC5vbigna2V5ZG93bicsIGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0XHRcdGZvcm1Hcm91cC5yZW1vdmVDbGFzcygnZXJyb3InKTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0dmFsaWQgPSBmYWxzZTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Zm9ybUdyb3VwLnJlbW92ZUNsYXNzKCdlcnJvcicpO1xyXG5cdFx0XHRcdFx0Zm9ybUdyb3VwLmZpbmQoJy50b29sdGlwJykucmVtb3ZlKCk7XHJcblx0XHRcdFx0fTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHR2YXIgY2hlY2tHcm91cCA9ICQoJy5mb3JtX19jaGVja3MnKSxcclxuXHRcdFx0XHR0b29sdGlwID0gJCgnPHNwYW4gY2xhc3M9XCJ0b29sdGlwXCI+0KDQvtCx0L7RgtCw0Lwg0YLRg9GCINC90LUg0LzQtdGB0YLQvjwvc3Bhbj4nKTtcclxuXHJcblx0XHRcdGlmIChjaGVja3MubGVuZ3RoID4gMCkge1xyXG5cclxuXHRcdFx0XHRpZiAoY2hlY2tzT2subGVuZ3RoIDwgMikge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ2NoZWNrIHNvbWVvbmUnKTtcclxuXHRcdFx0XHRcdGNoZWNrR3JvdXAuZmluZCgnLnRvb2x0aXAnKS5yZW1vdmUoKTtcclxuXHRcdFx0XHRcdHRvb2x0aXAuYXBwZW5kVG8oY2hlY2tHcm91cCk7XHJcblx0XHRcdFx0XHR2YWxpZCA9IGZhbHNlO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRjaGVja0dyb3VwLmZpbmQoJy50b29sdGlwJykucmVtb3ZlKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiB2YWxpZDtcclxuXHRcdH1cclxuXHJcblx0fVxyXG5cclxuXHRmb3JtVmFsaWRhdGUuZG9pdCgpO1xyXG59KCkpOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
