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
			$('#admDoneBtn').on('click', addPost.closeDoneWin);
			$(document).ready(function() {
				if ( $("div").is("#admPostList") ){
					addPost.showPosts();
				};
				if ( $("div").is("#blogPage") ){
					addPost.blogPagePosts();
					addPost.blogNav();
				};
			});
		},

		closeDoneWin: function (e) {
			e.preventDefault();
			var $this = $(this),
				winWrap = $this.closest('.admpanel__done__wrapper');
			winWrap.hide();
			addPost.showPosts();
		},

		showPosts: function(){
			$.ajax({
				url: '/showpost',
				type: 'GET',
				dataType: 'html',
				success: function(data){
					$('#posts').empty().append(data);
				}
			});
		},

		blogPagePosts: function(){
			$.ajax({
				url: '/blogpage',
				type: 'GET',
				dataType: 'html',
				success: function(data){
					$('#posts').empty().append(data);
				}
			});
		},

		blogNav: function(){
			$.ajax({
				url: '/blogmenu',
				type: 'GET',
				dataType: 'html',
				success: function(data){
					$('#blogNav').empty().append(data);
				}
			});

		},

		addPostInBlog: function(e){
			e.preventDefault();
			var form = $(this),
				inputs = $(this).find('input').val(),
				textarea = $(this).find('textarea').val(),
				myLineBreak = textarea.replace(/\n\r?/g, '<br />');
			if (inputs.length > 0) {
				//var dataForm = $(this).serializeArray();
				var dataForm = {
					postTitle: $(this).find('input[name=postTitle]').val(),
					postDate: $(this).find('input[name=postDate]').val(),
					postContent: myLineBreak
				}
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFkZFBvc3QuanMiLCJibG9nbWVudS5qcyIsImJsdXIuanMiLCJmaXhlZC1ibG9nLW1lbnUuanMiLCJmbGlwLmpzIiwicGFyYWxheC5qcyIsInByZWxvYWRlci5qcyIsInNob3dtZW51LmpzIiwic2xpZGVyLmpzIiwic21vb3Roc2Nyb29sLmpzIiwidmFsaWRhdGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgZG9jID0gZG9jdW1lbnQsXHJcblx0akRvYyA9ICQoZG9jdW1lbnQpO1xyXG5cclxudmFyIHN2ZzRldmVyeWJvZHkgPSAoZnVuY3Rpb24oKXtcclxuXHRzdmc0ZXZlcnlib2R5KCk7XHJcbn0oKSk7IiwiKGZ1bmN0aW9uKCl7XHJcblxyXG5cdHZhciBhZGRQb3N0ID0ge1xyXG5cclxuXHRcdGRvaXQ6IGZ1bmN0aW9uKCl7XHJcblx0XHRcdHRoaXMubGlzdGVuZXJzKCk7XHJcblx0XHR9LFxyXG5cclxuXHRcdGxpc3RlbmVyczogZnVuY3Rpb24oKSB7XHJcblx0XHRcdCQoJyNhZGRQb3N0Jykub24oJ3N1Ym1pdCcsIGFkZFBvc3QuYWRkUG9zdEluQmxvZyk7XHJcblx0XHRcdCQoJyNkZWxldGVQb3N0Jykub24oJ3N1Ym1pdCcsIGFkZFBvc3QuZGVsZXRlUG9zdCk7XHJcblx0XHRcdCQoJyNhZG1Eb25lQnRuJykub24oJ2NsaWNrJywgYWRkUG9zdC5jbG9zZURvbmVXaW4pO1xyXG5cdFx0XHQkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRpZiAoICQoXCJkaXZcIikuaXMoXCIjYWRtUG9zdExpc3RcIikgKXtcclxuXHRcdFx0XHRcdGFkZFBvc3Quc2hvd1Bvc3RzKCk7XHJcblx0XHRcdFx0fTtcclxuXHRcdFx0XHRpZiAoICQoXCJkaXZcIikuaXMoXCIjYmxvZ1BhZ2VcIikgKXtcclxuXHRcdFx0XHRcdGFkZFBvc3QuYmxvZ1BhZ2VQb3N0cygpO1xyXG5cdFx0XHRcdFx0YWRkUG9zdC5ibG9nTmF2KCk7XHJcblx0XHRcdFx0fTtcclxuXHRcdFx0fSk7XHJcblx0XHR9LFxyXG5cclxuXHRcdGNsb3NlRG9uZVdpbjogZnVuY3Rpb24gKGUpIHtcclxuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHR2YXIgJHRoaXMgPSAkKHRoaXMpLFxyXG5cdFx0XHRcdHdpbldyYXAgPSAkdGhpcy5jbG9zZXN0KCcuYWRtcGFuZWxfX2RvbmVfX3dyYXBwZXInKTtcclxuXHRcdFx0d2luV3JhcC5oaWRlKCk7XHJcblx0XHRcdGFkZFBvc3Quc2hvd1Bvc3RzKCk7XHJcblx0XHR9LFxyXG5cclxuXHRcdHNob3dQb3N0czogZnVuY3Rpb24oKXtcclxuXHRcdFx0JC5hamF4KHtcclxuXHRcdFx0XHR1cmw6ICcvc2hvd3Bvc3QnLFxyXG5cdFx0XHRcdHR5cGU6ICdHRVQnLFxyXG5cdFx0XHRcdGRhdGFUeXBlOiAnaHRtbCcsXHJcblx0XHRcdFx0c3VjY2VzczogZnVuY3Rpb24oZGF0YSl7XHJcblx0XHRcdFx0XHQkKCcjcG9zdHMnKS5lbXB0eSgpLmFwcGVuZChkYXRhKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fSxcclxuXHJcblx0XHRibG9nUGFnZVBvc3RzOiBmdW5jdGlvbigpe1xyXG5cdFx0XHQkLmFqYXgoe1xyXG5cdFx0XHRcdHVybDogJy9ibG9ncGFnZScsXHJcblx0XHRcdFx0dHlwZTogJ0dFVCcsXHJcblx0XHRcdFx0ZGF0YVR5cGU6ICdodG1sJyxcclxuXHRcdFx0XHRzdWNjZXNzOiBmdW5jdGlvbihkYXRhKXtcclxuXHRcdFx0XHRcdCQoJyNwb3N0cycpLmVtcHR5KCkuYXBwZW5kKGRhdGEpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9LFxyXG5cclxuXHRcdGJsb2dOYXY6IGZ1bmN0aW9uKCl7XHJcblx0XHRcdCQuYWpheCh7XHJcblx0XHRcdFx0dXJsOiAnL2Jsb2dtZW51JyxcclxuXHRcdFx0XHR0eXBlOiAnR0VUJyxcclxuXHRcdFx0XHRkYXRhVHlwZTogJ2h0bWwnLFxyXG5cdFx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0XHRcdFx0JCgnI2Jsb2dOYXYnKS5lbXB0eSgpLmFwcGVuZChkYXRhKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdH0sXHJcblxyXG5cdFx0YWRkUG9zdEluQmxvZzogZnVuY3Rpb24oZSl7XHJcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0dmFyIGZvcm0gPSAkKHRoaXMpLFxyXG5cdFx0XHRcdGlucHV0cyA9ICQodGhpcykuZmluZCgnaW5wdXQnKS52YWwoKSxcclxuXHRcdFx0XHR0ZXh0YXJlYSA9ICQodGhpcykuZmluZCgndGV4dGFyZWEnKS52YWwoKSxcclxuXHRcdFx0XHRteUxpbmVCcmVhayA9IHRleHRhcmVhLnJlcGxhY2UoL1xcblxccj8vZywgJzxiciAvPicpO1xyXG5cdFx0XHRpZiAoaW5wdXRzLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHQvL3ZhciBkYXRhRm9ybSA9ICQodGhpcykuc2VyaWFsaXplQXJyYXkoKTtcclxuXHRcdFx0XHR2YXIgZGF0YUZvcm0gPSB7XHJcblx0XHRcdFx0XHRwb3N0VGl0bGU6ICQodGhpcykuZmluZCgnaW5wdXRbbmFtZT1wb3N0VGl0bGVdJykudmFsKCksXHJcblx0XHRcdFx0XHRwb3N0RGF0ZTogJCh0aGlzKS5maW5kKCdpbnB1dFtuYW1lPXBvc3REYXRlXScpLnZhbCgpLFxyXG5cdFx0XHRcdFx0cG9zdENvbnRlbnQ6IG15TGluZUJyZWFrXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdCQuYWpheCh7XHJcblx0XHRcdFx0XHR1cmw6ICcvc2F2ZXBvc3QnLFxyXG5cdFx0XHRcdFx0dHlwZTogJ1BPU1QnLFxyXG5cdFx0XHRcdFx0ZGF0YVR5cGU6ICdqc29uJyxcclxuXHRcdFx0XHRcdGRhdGE6IGRhdGFGb3JtLFxyXG5cdFx0XHRcdFx0c3VjY2VzczogZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0XHR2YXIgd1dpZHRoID0gJCh3aW5kb3cpLndpZHRoKCksXHJcblx0XHRcdFx0XHRcdFx0d0hlaWdodCA9ICQod2luZG93KS5oZWlnaHQoKSxcclxuXHRcdFx0XHRcdFx0XHR3U2Nyb2xsID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xyXG5cclxuXHRcdFx0XHRcdFx0JCgnLmFkbXBhbmVsX19kb25lX190ZXh0JykudGV4dCgn0J/QvtGB0YIg0LTQvtCx0LDQstC70LXQvScpO1xyXG5cdFx0XHRcdFx0XHQkKCcuYWRtcGFuZWxfX2RvbmVfX3dyYXBwZXInKS5jc3Moe3dpZHRoOiB3V2lkdGgsIGhlaWdodDogd0hlaWdodCwgdG9wOiB3U2Nyb2xsfSkuZmFkZUluKCk7XHJcblx0XHRcdFx0XHRcdGZvcm1bMF0ucmVzZXQoKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coJ2VtcHR5Jyk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9LCAvLyBhZGQgcG9zdFxyXG5cclxuXHRcdGRlbGV0ZVBvc3Q6IGZ1bmN0aW9uIChlKSB7XHJcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0dmFyIGZvcm0gPSAkKHRoaXMpLFxyXG5cdFx0XHRcdGlucHV0cyA9ICQodGhpcykuZmluZCgnaW5wdXQnKS52YWwoKTtcclxuXHJcblx0XHRcdGlmIChpbnB1dHMubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdHZhciBkYXRhRm9ybSA9ICQodGhpcykuc2VyaWFsaXplQXJyYXkoKTtcclxuXHRcdFx0XHQkLmFqYXgoe1xyXG5cdFx0XHRcdFx0dXJsOiAnL2RlbGV0ZScsXHJcblx0XHRcdFx0XHR0eXBlOiAnUE9TVCcsXHJcblx0XHRcdFx0XHRkYXRhVHlwZTogJ2pzb24nLFxyXG5cdFx0XHRcdFx0ZGF0YTogZGF0YUZvcm0sXHJcblx0XHRcdFx0XHRzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG5cdFx0XHRcdFx0XHR2YXIgd1dpZHRoID0gJCh3aW5kb3cpLndpZHRoKCksXHJcblx0XHRcdFx0XHRcdFx0d0hlaWdodCA9ICQod2luZG93KS5oZWlnaHQoKSxcclxuXHRcdFx0XHRcdFx0XHR3U2Nyb2xsID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xyXG5cclxuXHRcdFx0XHRcdFx0JCgnLmFkbXBhbmVsX19kb25lX190ZXh0JykudGV4dCgn0J/QvtGB0YIg0YPQtNCw0LvQtdC9Jyk7XHJcblx0XHRcdFx0XHRcdCQoJy5hZG1wYW5lbF9fZG9uZV9fd3JhcHBlcicpLmNzcyh7d2lkdGg6IHdXaWR0aCwgaGVpZ2h0OiB3SGVpZ2h0LCB0b3A6IHdTY3JvbGx9KS5mYWRlSW4oKTtcclxuXHRcdFx0XHRcdFx0Zm9ybVswXS5yZXNldCgpO1xyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZygnZGVsZXRlJyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coJ2VtcHR5Jyk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0fVxyXG5cclxuXHRhZGRQb3N0LmRvaXQoKTtcclxuXHJcbn0oKSk7IiwiLy8g0L3QsNCy0LjQs9Cw0YbQuNGPINCyINCx0LvQvtCz0LVcclxuXHJcbnZhciBjaGVja1NlY3Rpb24gPSAoZnVuY3Rpb24gKCl7XHJcblx0Ly8gcHJpdmF0ZVxyXG5cdHZhciBmb2xsb3dCbG9nTGluayA9IGZ1bmN0aW9uKGVkZ2Upe1xyXG5cdFx0JCgnLmJsb2dfX3Bvc3QnKS5lYWNoKGZ1bmN0aW9uKGksIGVsKXtcclxuXHRcdFx0XHR2YXIgJHRoaXMgPSAkKHRoaXMpLFxyXG5cdFx0XHRcdHRvcEVkZ2UgPSAkdGhpcy5vZmZzZXQoKS50b3AgLSBlZGdlLFxyXG5cdFx0XHRcdGJvdHRvbUVkZ2UgPSB0b3BFZGdlICsgJHRoaXMuaGVpZ2h0KCksXHJcblx0XHRcdFx0d1Njcm9sbCA9ICQod2luZG93KS5zY3JvbGxUb3AoKTtcclxuXHJcblx0XHRcdFx0aWYgKHRvcEVkZ2UgPCB3U2Nyb2xsICYmIGJvdHRvbUVkZ2UgPiB3U2Nyb2xsKSB7XHJcblx0XHRcdFx0XHR2YXIgY3VycmVudElkID0gJHRoaXMuZGF0YSgnc2VjdGlvbicpLFxyXG5cdFx0XHRcdFx0XHRyZXFMaW5rID0gJCgnLmJsb2dfX25hdl9fbGluaycpLmZpbHRlcignW2hyZWYgPSBcIiMnICsgY3VycmVudElkICsgJ1wiXScpO1xyXG5cclxuXHRcdFx0XHRcdHJlcUxpbmsuY2xvc2VzdCgnLmJsb2dfX25hdl9faXRlbScpLmFkZENsYXNzKCdhY3RpdmUnKVxyXG5cdFx0XHRcdFx0XHQuc2libGluZ3MoKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHR9O1xyXG5cclxuXHQvLyBwdWJsaWNcclxuXHRyZXR1cm4ge1xyXG5cdFx0aW5pdDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciB3V2lkdGggPSAkKHdpbmRvdykud2lkdGgoKTtcclxuXHRcdFx0aWYgKCB3V2lkdGggPiA3NjggKSB7XHJcblx0XHRcdFx0Zm9sbG93QmxvZ0xpbmsoNzApO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGZvbGxvd0Jsb2dMaW5rKDIwMCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcbn0oKSk7XHJcblxyXG4kKHdpbmRvdykuc2Nyb2xsKGZ1bmN0aW9uKCl7XHJcblx0Y2hlY2tTZWN0aW9uLmluaXQoKTtcclxufSk7IiwidmFyIGJsdXIgPSBmdW5jdGlvbiAoKSB7XHJcblx0dmFyIHdyYXBwZXIgPSBkb2MucXVlcnlTZWxlY3RvcignLmJsdXJfX3dyYXBwZXInKSxcclxuXHRcdGZvcm0gPSBkb2MucXVlcnlTZWxlY3RvcignLmJsdXJfX2Zvcm0nKTtcclxuXHJcblx0cmV0dXJuIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRpZiAod3JhcHBlciwgZm9ybSkge1xyXG5cdFx0XHRcdHZhciBpbWdXaWR0aCA9IGRvYy5xdWVyeVNlbGVjdG9yKCcuYmx1cl9fYmFja2dyb3VuZCcpLm9mZnNldFdpZHRoLFxyXG5cdFx0XHRcdFx0cG9zTGVmdCA9IC13cmFwcGVyLm9mZnNldExlZnQsXHJcblx0XHRcdFx0XHRwb3NUb3AgPSAtd3JhcHBlci5vZmZzZXRUb3AsXHJcblx0XHRcdFx0XHRibHVyQ1NTID0gZm9ybS5zdHlsZTtcclxuXHJcblx0XHRcdFx0Ymx1ckNTUy5iYWNrZ3JvdW5kU2l6ZSA9IGltZ1dpZHRoICsgJ3B4ICcgKyAnYXV0byc7XHJcblx0XHRcdFx0Ymx1ckNTUy5iYWNrZ3JvdW5kUG9zaXRpb24gPSBwb3NMZWZ0ICsgJ3B4ICcgKyBwb3NUb3AgKyAncHgnO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcbn07XHJcblxyXG52YXIgbWFrZUJsdXIgPSBibHVyKCk7XHJcblxyXG5tYWtlQmx1cigpO1xyXG5cclxud2luZG93Lm9ucmVzaXplID0gZnVuY3Rpb24gKCkge1xyXG5cdG1ha2VCbHVyKCk7XHJcbn07IiwidmFyIGZpeGVkQmxvZ01lbnUgPSAoZnVuY3Rpb24gKCkge1xyXG5cdC8vIHByaXZhdGVcclxuXHR2YXIgbW92ZU1lbnUgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHR2YXIgd1dpZHRoID0gJCh3aW5kb3cpLndpZHRoKCk7XHJcblxyXG5cdFx0aWYgKCB3V2lkdGggPiA3NjggKSB7XHJcblx0XHRcdHZhciBtZW51V2lkdGggPSAkKCcuYmxvZ19fbmF2X19pdGVtcycpLndpZHRoKCksXHJcblx0XHRcdHdTY3JvbGwgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCksXHJcblx0XHRcdG9mZnNldCA9ICQoJy5ibG9nX19uYXYnKS5vZmZzZXQoKSxcclxuXHRcdFx0bWVudSA9ICQoJy5ibG9nX19uYXZfX2l0ZW1zJyk7XHJcblxyXG5cdFx0XHRpZiAoIChvZmZzZXQudG9wIC0gNzApIDwgd1Njcm9sbCApIHtcclxuXHRcdFx0XHRtZW51LmFkZENsYXNzKCdibG9nX19uYXZfX2l0ZW1zLWZpeGVkJyk7XHJcblx0XHRcdFx0bWVudS5jc3Moe3dpZHRoOiBtZW51V2lkdGgsIGxlZnQ6IG9mZnNldC5sZWZ0ICsgOX0pO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdG1lbnUucmVtb3ZlQ2xhc3MoJ2Jsb2dfX25hdl9faXRlbXMtZml4ZWQnKTtcclxuXHRcdFx0XHRtZW51LnJlbW92ZUF0dHIoJ3N0eWxlJyk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9IC8vIGlmXHJcblx0fTtcclxuXHJcblx0dmFyIHN3aXBlTWVudSA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdCQoJy5qcy1tb2JCdXR0b24nKS5vbignY2xpY2snLCBmdW5jdGlvbihlKXtcclxuXHJcblx0XHRcdCQoJy5ibG9nX19uYXYnKS50b2dnbGVDbGFzcygnanMtc2hvd01lbnUnKTtcclxuXHRcdFx0JCgnLndyYXBwZXItYmxvZycpLnRvZ2dsZUNsYXNzKCdqcy1tb3ZlTGVmdCcpO1xyXG5cclxuXHRcdH0pO1xyXG5cdH07XHJcblxyXG5cdC8vIHB1YmxpY1xyXG5cdHJldHVybiB7XHJcblx0XHRmaXhlZG1lbnU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRpZiAoICQoJy5ibG9nX19uYXYnKS5sZW5ndGggKSB7XHJcblx0XHRcdFx0XHRtb3ZlTWVudSgpO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cclxuXHRcdG9wZW5NZW51OiBmdW5jdGlvbigpe1xyXG5cdFx0XHRpZiAoICQoJy5ibG9nX19uYXYnKS5sZW5ndGggKSB7XHJcblx0XHRcdFx0c3dpcGVNZW51KCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG59KCkpOyAvLyBlbmQgbWFpbiBmdW5jdGlvblxyXG5cclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XHJcblx0JCh3aW5kb3cpLnNjcm9sbChmdW5jdGlvbihldmVudCkge1xyXG5cdFx0Zml4ZWRCbG9nTWVudS5maXhlZG1lbnUoKTtcclxuXHR9KTtcclxuXHQkKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uKGV2ZW50KSB7XHJcblx0XHRmaXhlZEJsb2dNZW51LmZpeGVkbWVudSgpO1xyXG5cdH0pO1xyXG5cdGZpeGVkQmxvZ01lbnUub3Blbk1lbnUoKTtcclxufSk7XHJcblxyXG5cclxuIiwidmFyIGZsaXBFZmZlY3QgPSAoZnVuY3Rpb24oKSB7XHJcblx0dmFyIGZsaXBCdG4gPSAkKCcuZmxpcC1idG4nKSxcclxuXHRcdGZsaXBSZXR1cm4gPSAkKCcuZmxpcC1idG4tcmV0dXJuJyksXHJcblx0XHRjb250YWluZXIgPSAkKCcuZmxpcGNvbnRhaW5lcicpO1xyXG5cclxuXHRyZXR1cm4ge1xyXG5cdFx0aW5pdDogZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRmbGlwQnRuLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpe1xyXG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHRjb250YWluZXIudG9nZ2xlQ2xhc3MoJ2ZsaXAnKTtcclxuXHRcdFx0XHRmbGlwQnRuLnRvZ2dsZUNsYXNzKCdoaWRlJyk7XHJcblx0XHRcdFx0JCgnLnRvb2x0aXAnKS5yZW1vdmUoKTtcclxuXHRcdFx0XHQkKCcuZm9ybScpLmZpbmQoJy5lcnJvcicpLnJlbW92ZUNsYXNzKFwiZXJyb3JcIik7XHJcblx0XHRcdFx0JCgnZm9ybScpWzBdLnJlc2V0KCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRmbGlwUmV0dXJuLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpe1xyXG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHRjb250YWluZXIudG9nZ2xlQ2xhc3MoJ2ZsaXAnKTtcclxuXHRcdFx0XHRmbGlwQnRuLnRvZ2dsZUNsYXNzKCdoaWRlJyk7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHQvLyDQv9C10YDQtdCy0L7RgNCw0YfQuNCy0LDQtdC8INGE0L7RgNC80YMg0L/QviDQutC70LjQutGDINCy0L3QtSDRhNC+0YDQvNGLXHJcblx0XHRcdGpEb2MubW91c2V1cChmdW5jdGlvbiAoZSkge1xyXG5cdFx0XHRcdGlmIChjb250YWluZXIuaGFzKGUudGFyZ2V0KS5sZW5ndGggPT09IDApe1xyXG5cdFx0XHRcdFx0Y29udGFpbmVyLnJlbW92ZUNsYXNzKCdmbGlwJyk7XHJcblx0XHRcdFx0XHRmbGlwQnRuLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG59O1xyXG59KCkpO1xyXG5cclxuZmxpcEVmZmVjdC5pbml0KCk7IiwiLy8g0YHQvtC30LTQsNC10Lwg0L/QsNGA0LDQu9Cw0LrRgVxyXG52YXIgcGFyYWxsYXggPSAoZnVuY3Rpb24gKCkge1xyXG5cdC8vINCx0LXRgNC10Lwg0Y3Qu9C10LzQtdC90YLRiywg0LrQvtGC0L7RgNGL0LUg0LHRg9C00LXQvCDQtNCy0LjQs9Cw0YLRjFxyXG5cdHZhclx0YmcgPSBkb2MucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fcGljdHVyZScpLCAvLyDQsdC10YDQtdC8INCx0LvQvtC6INGBINC60LDRgNGC0LjQvdC60L7QuVxyXG5cdFx0dXNlciA9IGRvYy5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX191c2VyJyksIC8vINCx0LvQvtC6INGBINGO0LfQtdGA0L7QvFxyXG5cdFx0c2VjdGlvblRleHQgPSBkb2MucXVlcnlTZWxlY3RvcignLmhlYWRlcl9faWNvbicpOyAvLyDQsdC70L7QuiDRgSBQb3J0Zm9saW9cclxuXHQvLyDQstC+0LfQstGA0LDRidCw0LXQvCDRgNC10LfRg9C70YzRgtCw0YIg0YTRg9C90LrRhtC40LhcclxuXHRyZXR1cm4ge1xyXG5cdFx0Ly8gbW92ZVxyXG5cdFx0bW92ZTogZnVuY3Rpb24gKGJsb2NrLHdpbmRvd1Njcm9sbCxzdHJhZmVBbW91bnQpIHtcclxuXHRcdFx0Ly8gYmxvY2sgLSDQutCw0LrQvtC5INCx0LvQvtC6INC00LLQuNCz0LDQtdC8XHJcblx0XHRcdC8vIHdpbmRvd1Njcm9sbCAtINC90LAg0YHQutC+0LvRjNC60L4g0L/RgNC+0LvQuNGB0YLQsNC70Lgg0YHRgtGA0LDQvdC40YbRg1xyXG5cdFx0XHQvLyBzdHJhZmVBbW91bnQgLSDQutC+0Y3RhNGE0LXRhtC40LXQvdGCLCDQvdCwINC60L7RgtC+0YDRi9C5INCx0YPQtNC10Lwg0LTQtdC70LjRgtGMINC00LvRjyDRgdC60L7RgNC+0YHRgtC4XHJcblx0XHRcdC8vINCy0YvRh9C40YHQu9GP0LXQvCDQt9C90LDRh9C10L3QuNC1INC00LvRjyDQtNCy0LjQttC10L3QuNGPINCyINC/0YDQvtGG0LXQvdGC0LDRhVxyXG5cdFx0XHR2YXIgc3RyYWZlID0gd2luZG93U2Nyb2xsIC8gLXN0cmFmZUFtb3VudCArICclJztcclxuXHRcdFx0Ly8g0L/QtdGA0LXQutC70Y7Rh9Cw0LXQvCDQvdCw0LPRgNGD0LfQutGDINC90LAg0LLQuNC00LXQvtC60LDRgNGC0YNcclxuXHRcdFx0dmFyIHRyYW5zZm9ybVN0cmluZyA9ICd0cmFuc2xhdGUzZCgwLCcgKyBzdHJhZmUgKyAnLDApJztcclxuXHRcdFx0Ly8g0LTQvtCx0LDQstC70Y/QtdC8INGB0YLQuNC70Ywg0Log0L3QsNGI0LXQvNGDINCx0LvQvtC60YNcclxuXHRcdFx0dmFyIHN0eWxlID0gYmxvY2suc3R5bGU7XHJcblx0XHRcdC8vINC40YHQv9C+0LvRjNC30YPQtdC8IHRyYW5zZm9ybSDQtNC70Y8g0YHQvNC10YnQtdC90LjRj1xyXG5cdFx0XHQvLyDQsiDRjdGC0L7QvCDRgdC70YPRh9Cw0LUg0L/RgNC+0YHRh9C10YIg0L7RgdGD0YnQtdGB0YLQstC70Y/QtdGC0YHRjyDRgtC+0LvRjNC60L4g0L7QtNC40L0g0YDQsNC3LCDRh9GC0L4g0YHQvdC40LbQsNC10YIg0L3QsNCz0YDRg9C30LrRg1xyXG5cdFx0XHRzdHlsZS50cmFuc2Zvcm0gPSB0cmFuc2Zvcm1TdHJpbmc7XHJcblx0XHRcdHN0eWxlLndlYmtpdFRyYW5zZm9ybSA9IHRyYW5zZm9ybVN0cmluZztcclxuXHRcdFx0Ly8g0L/RgNC40YHQstCw0LjQstCw0LXQvCDQt9C90LDRh9C10L3QuNGOICd0b3AnINC/0LXRgNC10LzQtdC90L3Rg9GOIHN0cmFmZSAtINGN0YLQviDQsdGD0LTQtdGCINC/0YDQvtGG0LXQvdGCINGB0LzQtdGJ0LXQvdC40Y9cclxuXHRcdFx0c3R5bGUudG9wID0gc3RyYWZlO1xyXG5cdFx0fSxcclxuXHRcdC8vIGluaXRcclxuXHRcdGluaXQ6IGZ1bmN0aW9uKHdTY3JvbGwpIHtcclxuXHRcdFx0Ly8g0LTQstC40LPQsNC10LwgJ2JnJyDQsiDQt9Cw0LLQuNGB0LjQvNC+0YHRgtC4INC+0YIgJ3dTY3JvbGwnINC4INC30LDQtNCw0LXQvCDQutC+0Y3RhNGE0LjRhtC40LXRgiAo0YfQtdC8INC+0L0g0LHQvtC70YzRiNC1LCDRgtC10Lwg0LzQtdC00LvQtdC90L3QtdC1INC00LLQuNCz0LDQtdGC0YHRjylcclxuXHRcdFx0aWYgKGJnKSB7XHJcblx0XHRcdFx0dGhpcy5tb3ZlKGJnLCB3U2Nyb2xsLCA2MCk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKHNlY3Rpb25UZXh0KSB7XHJcblx0XHRcdFx0dGhpcy5tb3ZlKHNlY3Rpb25UZXh0LCB3U2Nyb2xsLCAzMCk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKHVzZXIpIHtcclxuXHRcdFx0XHR0aGlzLm1vdmUodXNlciwgd1Njcm9sbCwgNTApO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG59KCkpO1xyXG5cclxud2luZG93Lm9uc2Nyb2xsID0gZnVuY3Rpb24oKSB7XHJcblx0Ly8g0YPQt9C90LDQtdC8INC90LAg0YHQutC+0LvRjNC60L4g0L/RgNC+0LrRgNGD0YLQuNC70Lgg0YHRgtGA0LDQvdC40YbRg1xyXG5cdHZhciB3U2Nyb2xsID0gd2luZG93LnBhZ2VZT2Zmc2V0O1xyXG5cclxuXHQvLyDQstGL0LfRi9Cy0LDQtdC8IHBhcmFsbGF4INC/0L4g0YHQutGA0L7Qu9C70YNcclxuXHRwYXJhbGxheC5pbml0KHdTY3JvbGwpO1xyXG59OyIsInZhciBwcmVsb2FkZXIgPSAoZnVuY3Rpb24oKXtcclxuXHJcblx0dmFyIHBlcmNlbnRzVG90YWwgPSAxLFxyXG5cdFx0cHJlbG9hZGVyID0gJCgnLnByZWxvYWRlcicpO1xyXG5cclxuXHR2YXIgaW1nUGF0aCA9ICQoJyonKS5tYXAoZnVuY3Rpb24oaW5kZXgsIGVsZW1lbnQpIHtcclxuXHRcdHZhciBiZ3JvdW5kID0gJChlbGVtZW50KS5jc3MoJ2JhY2tncm91bmQtaW1hZ2UnKSxcclxuXHRcdFx0aW1nID0gJChlbGVtZW50KS5pcygnaW1nJyksXHJcblx0XHRcdHBhdGggPSAnJztcclxuXHJcblx0XHRpZiAoYmdyb3VuZCAhPSAnbm9uZScpIHtcclxuXHRcdFx0cGF0aCA9IGJncm91bmQucmVwbGFjZSgndXJsKFwiJywgJycpLnJlcGxhY2UoJ1wiKScsICcnKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoaW1nKSB7XHJcblx0XHRcdHBhdGggPSAkKGVsZW1lbnQpLmF0dHIoJ3NyYycpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChwYXRoKSByZXR1cm4gcGF0aFxyXG5cdH0pXHJcblxyXG5cdHZhciBzZXRQZXJjZW50cyA9IGZ1bmN0aW9uKHRvdGFsLCBjdXJyZW50KSB7XHJcblx0XHR2YXIgcGVyY2VudHMgPSBNYXRoLmNlaWwoY3VycmVudCAvIHRvdGFsICogMTAwKTtcclxuXHJcblx0XHQkKCcucHJlbG9hZGVyX19wZXJjZW50cycpLnRleHQocGVyY2VudHMpO1xyXG5cclxuXHRcdGlmIChwZXJjZW50cyA+PSAxMDApIHtcclxuXHRcdFx0cHJlbG9hZGVyLmZhZGVPdXQoKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHZhciBsb2FkSW1hZ2VzID0gZnVuY3Rpb24oaW1hZ2VzKSB7XHJcblxyXG5cdFx0aWYoIWltYWdlcy5sZW5ndGgpIHByZWxvYWRlci5mYWRlT3V0KCk7XHJcblxyXG5cdFx0aW1hZ2VzLmZvckVhY2goZnVuY3Rpb24oaW1nLCBpLCBpbWFnZXMpIHtcclxuXHRcdFx0dmFyIGZha2VJbWcgPSAkKCc8aW1nPicsIHtcclxuXHRcdFx0XHRhdHRyIDoge1xyXG5cdFx0XHRcdFx0c3JjOiBpbWdcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0ZmFrZUltZy5vbignbG9hZCBlcnJvcicsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHNldFBlcmNlbnRzKGltYWdlcy5sZW5ndGgsIHBlcmNlbnRzVG90YWwpO1xyXG5cdFx0XHRcdHBlcmNlbnRzVG90YWwrKztcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdHJldHVybiB7XHJcblx0XHRpbml0OiBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdHZhciBpbWdzID0gaW1nUGF0aC50b0FycmF5KCk7XHJcblx0XHRcdGxvYWRJbWFnZXMoaW1ncyk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxufSAoKSApO1xyXG5cclxuJChmdW5jdGlvbiAoKSB7XHJcblx0cHJlbG9hZGVyLmluaXQoKTtcclxufSk7IiwidmFyIHNob3dNZW51ID0oZnVuY3Rpb24oKSB7XHJcblx0dmFyIG1lbnVCdG4gPSAkKCcjdG9nZ2xlbmF2JyksXHJcblx0XHRcdG1lbnUgPSBcdCQoJyNuYXZpZ2F0ZScpLFxyXG5cdFx0XHRtZW51SXRlbSA9ICQoJy5uYXZpZ2F0ZS10b3BfX2xpbmsnKSxcclxuXHRcdFx0aHRtbCA9ICQoJ2h0bWwnKSxcclxuXHRcdFx0YW5pbWF0ZSA9ICQoJy5uYXYtYW5pbWF0ZScpO1xyXG5cclxuXHR2YXIgb3Blbk1lbnUgPSBmdW5jdGlvbigpe1xyXG5cdFx0bWVudUJ0bi5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcblx0XHRcdG1lbnUudG9nZ2xlKDAsIGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0bWVudS50b2dnbGVDbGFzcygnbmF2aWdhdGUtc2hvdycpO1xyXG5cdFx0XHRcdG1lbnVCdG4udG9nZ2xlQ2xhc3MoJ2hhbWJ1cmdlcl9faWNvbi1jbG9zZScpO1xyXG5cdFx0XHRcdGh0bWwudG9nZ2xlQ2xhc3MoJ2hpZGVTY3JvbGwnKTtcclxuXHRcdFx0XHQkKCcubmF2aWdhdGUtdG9wJykuYWRkQ2xhc3MoJ25hdmlnYXRlLXRvcC1hbmltYXRlJyk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fTtcclxuXHJcblx0cmV0dXJuIHtcclxuXHRcdGluaXQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRvcGVuTWVudSgpO1xyXG5cdFx0fVxyXG5cdH1cclxufSAoKSApO1xyXG5cclxuc2hvd01lbnUuaW5pdCgpOyIsInZhciBzbGlkZXIgPSAoZnVuY3Rpb24oKXtcclxuXHRyZXR1cm4ge1xyXG5cdFx0aW5pdDogZnVuY3Rpb24oKXtcclxuXHJcblx0XHRcdHZhciBfdGhpcyA9IHRoaXMsXHJcblx0XHRcdFx0c2xpZGVySXRlbUFjdGl2ZSA9ICQoJy5zbGlkZXJfX2l0ZW0nKS5maXJzdCgpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuXHJcblx0XHRcdC8vINC00L7QsdCw0LLQu9GP0LXQvCDRgtC+0YfQutC4XHJcblx0XHRcdF90aGlzLm1ha2VEb3RzKCk7XHJcblxyXG5cdFx0XHQvLyDQttC80LXQvCDQutC90L7Qv9C60LhcclxuXHRcdFx0JCgnLnNsaWRlcl9fYnRuJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSl7XHJcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuXHRcdFx0XHR2YXIgJHRoaXMgPSAkKHRoaXMpLFxyXG5cdFx0XHRcdGl0ZW1zID0gJHRoaXMuY2xvc2VzdCgnLnNsaWRlcl9fY29udGFpbmVyJykuZmluZCgnLnNsaWRlcl9faXRlbScpLFxyXG5cdFx0XHRcdGFjdGl2ZUl0ZW0gPSBpdGVtcy5maWx0ZXIoJy5hY3RpdmUnKSxcclxuXHRcdFx0XHRuZXh0SXRlbSA9IGFjdGl2ZUl0ZW0ubmV4dCgpLFxyXG5cdFx0XHRcdHByZXZJdGVtID0gYWN0aXZlSXRlbS5wcmV2KCksXHJcblx0XHRcdFx0Zmlyc3RJdGVtID0gaXRlbXMuZmlyc3QoKSxcclxuXHRcdFx0XHRsYXN0U2xpZGUgPSBpdGVtcy5sYXN0O1xyXG5cclxuXHRcdFx0XHRpZiggJHRoaXMuaGFzQ2xhc3MoJ3NsaWRlcl9fYnRuLW5leHQnKSApe1xyXG5cclxuXHRcdFx0XHRcdGlmIChuZXh0SXRlbS5sZW5ndGgpIHtcclxuXHRcdFx0XHRcdFx0X3RoaXMubW92ZVNsaWRlKG5leHRJdGVtKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdF90aGlzLm1vdmVTbGlkZShmaXJzdEl0ZW0pO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0aWYgKHByZXZJdGVtLmxlbmd0aCkge1xyXG5cdFx0XHRcdFx0XHRfdGhpcy5tb3ZlU2xpZGUocHJldkl0ZW0pO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0X3RoaXMubW92ZVNsaWRlKGxhc3RJdGVtKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0Ly/QutC70LjQuiDQv9C+INGC0L7Rh9C60LDQvFxyXG5cdFx0XHQkKCcuc2xpZGVyX19kb3RzX19pdGVtcycpLm9uKCdjbGljaycsICcuc2xpZGVyX19kb3RzX19pdGVtJywgZnVuY3Rpb24oZSl7XHJcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRcdHZhciAkdGhpcyA9ICQodGhpcyksXHJcblx0XHRcdFx0XHRkb3RDbGljayA9ICR0aGlzLmluZGV4KCksXHJcblx0XHRcdFx0XHRzbGlkZSA9ICQoJy5zbGlkZXJfX2l0ZW0nKSxcclxuXHRcdFx0XHRcdGFjdGl2ZUl0ZW0gPSBzbGlkZS5maWx0ZXIoJy5hY3RpdmUnKTtcclxuXHJcblx0XHRcdFx0XHRpZiAoYWN0aXZlSXRlbS5pbmRleCgpIDwgZG90Q2xpY2spIHtcclxuXHRcdFx0XHRcdFx0X3RoaXMubW92ZVNsaWRlKHNsaWRlLmVxKGRvdENsaWNrKSk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRfdGhpcy5tb3ZlU2xpZGUoc2xpZGUuZXEoZG90Q2xpY2spKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0fSlcclxuXHRcdH0sXHJcblxyXG5cdFx0Ly8g0LTQstC40LPQsNC10Lwg0YHQu9Cw0LnQtNGLXHJcblx0XHRtb3ZlU2xpZGU6IGZ1bmN0aW9uKHNsaWRlKSB7XHJcblxyXG5cdFx0XHRcdHZhciBfdGhpcyA9IHRoaXMsXHJcblx0XHRcdFx0XHRjb250YWluZXIgPSBzbGlkZS5jbG9zZXN0KCcuc2xpZGVyX19jb250YWluZXInKSxcclxuXHRcdFx0XHRcdGl0ZW1zID0gY29udGFpbmVyLmZpbmQoJy5zbGlkZXJfX2l0ZW0nKSxcclxuXHRcdFx0XHRcdGFjdGl2ZSA9IGl0ZW1zLmZpbHRlcignLmFjdGl2ZScpO1xyXG5cclxuXHRcdFx0XHRpdGVtcy5hZGRDbGFzcygnaGlkZVNsaWRlJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZSBzaG93U2xpZGUnKTtcclxuXHRcdFx0XHRzbGlkZS5yZW1vdmVDbGFzcygnaGlkZVNsaWRlJykuYWRkQ2xhc3MoJ2FjdGl2ZSBzaG93U2xpZGUnKTtcclxuXHJcblx0XHRcdFx0X3RoaXMuYWN0aXZlRG90KGNvbnRhaW5lci5maW5kKCcuc2xpZGVyX19kb3RzX19pdGVtcycpKTtcclxuXHRcdH0sIC8vIG1vdmVTbGlkZVxyXG5cclxuXHRcdG1ha2VEb3RzOiBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdHZhciBfdGhpcyA9IHRoaXMsXHJcblx0XHRcdFx0Y29udGFpbmVyID0gJCgnLnNsaWRlcl9fY29udGFpbmVyJyksXHJcblx0XHRcdFx0ZG90SHRtbCA9ICc8bGkgY2xhc3M9XCJzbGlkZXJfX2RvdHNfX2l0ZW1cIj48YnV0dG9uIGNsYXNzPVwic2xpZGVyX19kb3RzX19idG5cIj48L2J1dHRvbj48L2xpPic7XHJcblxyXG5cdFx0XHRjb250YWluZXIuZWFjaChmdW5jdGlvbigpe1xyXG5cdFx0XHRcdHZhciAkdGhpcyA9ICQodGhpcyksXHJcblx0XHRcdFx0aXRlbXMgPSAkdGhpcy5maW5kKCcuc2xpZGVyX19pdGVtJyksXHJcblx0XHRcdFx0ZG90Q29udGFpbmVyID0gJHRoaXMuZmluZCgnLnNsaWRlcl9fZG90c19faXRlbXMnKTtcclxuXHJcblx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBpdGVtcy5zaXplKCk7IGkrKykge1xyXG5cdFx0XHRcdFx0ZG90Q29udGFpbmVyLmFwcGVuZChkb3RIdG1sKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdF90aGlzLmFjdGl2ZURvdChkb3RDb250YWluZXIpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0sIC8vIG1ha2VEb3RzXHJcblxyXG5cdFx0YWN0aXZlRG90OiBmdW5jdGlvbihjb250YWluZXIpIHtcclxuXHRcdFx0dmFyIGl0ZW1zID0gY29udGFpbmVyLmNsb3Nlc3QoJy5zbGlkZXJfX2NvbnRhaW5lcicpLmZpbmQoJy5zbGlkZXJfX2l0ZW0nKTtcclxuXHJcblx0XHRcdGNvbnRhaW5lclxyXG5cdFx0XHRcdC5maW5kKCcuc2xpZGVyX19kb3RzX19pdGVtJylcclxuXHRcdFx0XHQuZXEoaXRlbXMuZmlsdGVyKCcuYWN0aXZlJykuaW5kZXgoKSlcclxuXHRcdFx0XHQuYWRkQ2xhc3MoJ2FjdGl2ZScpXHJcblx0XHRcdFx0LnNpYmxpbmdzKClcclxuXHRcdFx0XHQucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cdFx0fSAvLyBhY3RpdmVEb3RcclxuXHR9IC8vIHJldHVyblxyXG59KCkpO1xyXG5cclxuaWYgKCQoJy5zbGlkZXJfX2NvbnRhaW5lcicpKSB7XHJcblx0XHRzbGlkZXIuaW5pdCgpO1xyXG59IiwiKGZ1bmN0aW9uKCl7XHJcblx0dmFyIHNtb3Roc2Nyb2xsID0ge1xyXG5cdFx0ZG9pdDogZnVuY3Rpb24oKXtcclxuXHRcdFx0dGhpcy5saXN0ZW5lcnMoKTtcclxuXHRcdH0sXHJcblxyXG5cdFx0bGlzdGVuZXJzOiBmdW5jdGlvbigpe1xyXG5cdFx0XHQkKCcjYXJyb3dEb3duJykub24oJ2NsaWNrJywgc21vdGhzY3JvbGwuc2Nyb2xsRG93bik7XHJcblx0XHRcdCQoJyNhcnJvd1VwJykub24oJ2NsaWNrJywgc21vdGhzY3JvbGwuc2Nyb2xsVXApO1xyXG5cdFx0fSxcclxuXHJcblx0XHRzY3JvbGxEb3duOiBmdW5jdGlvbihlKXtcclxuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHR2YXIgaGVhZGVySGVpZ2h0ID0gJCgnLmhlYWRlcicpLmhlaWdodCgpO1xyXG5cdFx0XHQkKCdib2R5JykuYW5pbWF0ZSh7c2Nyb2xsVG9wOiBoZWFkZXJIZWlnaHR9LCAxMDAwKTtcclxuXHRcdH0sXHJcblxyXG5cdFx0c2Nyb2xsVXA6IGZ1bmN0aW9uKGUpe1xyXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdCQoJ2JvZHknKS5hbmltYXRlKHtzY3JvbGxUb3A6IDB9LCAyMDAwKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHNtb3Roc2Nyb2xsLmRvaXQoKTtcclxufSgpKTsiLCIoZnVuY3Rpb24oKXtcclxuXHR2YXIgZm9ybVZhbGlkYXRlID0ge1xyXG5cdFx0ZG9pdDogZnVuY3Rpb24oKXtcclxuXHRcdFx0dGhpcy5saXN0ZW5lcnMoKTtcclxuXHRcdH0sXHJcblxyXG5cdFx0bGlzdGVuZXJzOiBmdW5jdGlvbigpe1xyXG5cdFx0XHQkKCcjbWFpbEZvcm0nKS5vbignc3VibWl0JywgZm9ybVZhbGlkYXRlLm1haWxtZSk7XHJcblx0XHRcdCQoJyNsb2dpbkZvcm0nKS5vbignc3VibWl0JywgZm9ybVZhbGlkYXRlLmxvZ2luVmFsaWQpO1xyXG5cdFx0fSxcclxuXHJcblx0XHRsb2dpblZhbGlkOiBmdW5jdGlvbihlKXtcclxuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHR2YXIgZm9ybSA9ICQodGhpcyk7XHJcblx0XHRcdGlmICggZm9ybVZhbGlkYXRlLnZhbGlkKGZvcm0pID09PSBmYWxzZSApIHJldHVybiBmYWxzZTtcclxuXHJcblx0XHRcdGNvbnNvbGUubG9nKCdjb21lIGluJyk7XHJcblx0XHR9LFxyXG5cclxuXHRcdG1haWxtZTogZnVuY3Rpb24oZSl7XHJcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0dmFyIGZvcm0gPSAkKHRoaXMpO1xyXG5cdFx0XHRpZiAoIGZvcm1WYWxpZGF0ZS52YWxpZChmb3JtKSA9PT0gZmFsc2UgKSByZXR1cm4gZmFsc2U7XHJcblxyXG5cdFx0XHR2YXIgZnJvbSxlbWFpbCxtZXNzYWdlLGRhdGE7XHJcblx0XHRcdHZhciBwYXR0ZXJuID0gL15bYS16MC05Xy1dK0BbYS16MC05LV0rXFwuKFthLXpdezEsNn1cXC4pP1thLXpdezIsNn0kL2k7XHJcblx0XHRcdGZyb209JChcIiNtYWlsTmFtZVwiKS52YWwoKTtcclxuXHRcdFx0ZW1haWw9JChcIiNtYWlsTWFpbFwiKS52YWwoKTtcclxuXHRcdFx0bWVzc2FnZT0kKFwiI21haWxNZXNzYWdlXCIpLnZhbCgpO1xyXG5cdFx0XHRkYXRhID0gZm9ybS5zZXJpYWxpemUoKTtcclxuXHRcdFx0aWYoZW1haWwgIT0gJycpe1xyXG5cdFx0XHRcdGlmKGVtYWlsLnNlYXJjaChwYXR0ZXJuKSA9PSAwKXtcclxuXHRcdFx0XHRcdCQuYWpheCh7XHJcblx0XHRcdFx0XHRcdHVybDogJy9zZW5kJyxcclxuXHRcdFx0XHRcdFx0dHlwZTogJ1BPU1QnLFxyXG5cdFx0XHRcdFx0XHRkYXRhOiBkYXRhXHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0LmRvbmUoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKFwic3VjY2Vzc1wiKTtcclxuXHRcdFx0XHRcdFx0Zm9ybS5zbGlkZVVwKDIwMCk7XHJcblx0XHRcdFx0XHRcdCQoJy53aW5kb3dfX21lbnUnKS5oaWRlKCk7XHJcblx0XHRcdFx0XHRcdCQoJy5mb3JtX19zdWNjZXMnKS5zaG93KCk7XHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0LmZhaWwoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiZXJyb3JcIik7XHJcblx0XHRcdFx0XHRcdGZvcm0uc2xpZGVVcCgyMDApO1xyXG5cdFx0XHRcdFx0XHQkKCcud2luZG93X19tZW51JykuaGlkZSgpO1xyXG5cdFx0XHRcdFx0XHQkKCcuZm9ybV9fZXJyb3InKS5zaG93KCk7XHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHQkKCdpbnB1dCNtYWlsTWFpbCcpLnBhcmVudHMoJy5mb3JtX190ZXh0JykuYWRkQ2xhc3MoJ2Vycm9yJyk7XHJcblx0XHRcdFx0XHQkKCc8c3BhbiBjbGFzcz1cInRvb2x0aXBcIj7QndC10LrQvtGA0YDQtdC60YLRgNGL0LkgZW1haWw8L3NwYW4+JykuYXBwZW5kVG8oJy5lcnJvcicpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHJcblx0XHR2YWxpZDogZnVuY3Rpb24oZm9ybSl7XHJcblx0XHRcdHZhciBpbnB1dHMgPSBmb3JtLmZpbmQoJ2lucHV0LCB0ZXh0YXJlYScpLFxyXG5cdFx0XHRcdGNoZWNrcyA9IGZvcm0uZmluZCgnaW5wdXQ6Y2hlY2tib3gsIGlucHV0OnJhZGlvJyksXHJcblx0XHRcdFx0Y2hlY2tzT2sgPSBmb3JtLmZpbmQoJ2lucHV0OmNoZWNrZWQnKSxcclxuXHRcdFx0XHR2YWxpZCA9IHRydWU7XHJcblxyXG5cdFx0XHQkLmVhY2goaW5wdXRzLCBmdW5jdGlvbihpbmRleCwgdmFsKSB7XHJcblx0XHRcdFx0dmFyIGlucHV0ID0gJCh2YWwpLFxyXG5cdFx0XHRcdHZhbCA9IGlucHV0LnZhbCgpLFxyXG5cdFx0XHRcdGZvcm1Hcm91cCA9IGlucHV0LnBhcmVudHMoJy5mb3JtX190ZXh0LCAuZm9ybV9fdGV4dF9pY29uJyksXHJcblx0XHRcdFx0bGFiZWwgPSBmb3JtR3JvdXAuZmluZCgnbGFiZWwnKS50ZXh0KCkudG9Mb3dlckNhc2UoKSxcclxuXHRcdFx0XHR0ZXh0RXJyb3IgPSAn0JLRiyDQvdC1INCy0LLQtdC70LggJyArIGxhYmVsLFxyXG5cdFx0XHRcdHRvb2x0aXAgPSAkKCc8c3BhbiBjbGFzcz1cInRvb2x0aXBcIj4nICsgdGV4dEVycm9yICsgJzwvc3Bhbj4nKTtcclxuXHJcblx0XHRcdFx0aWYgKHZhbC5sZW5ndGggPT09IDApe1xyXG5cdFx0XHRcdFx0Zm9ybUdyb3VwLmFkZENsYXNzKCdlcnJvcicpO1xyXG5cdFx0XHRcdFx0Zm9ybUdyb3VwLmZpbmQoJy50b29sdGlwJykucmVtb3ZlKCk7XHJcblx0XHRcdFx0XHR0b29sdGlwLmFwcGVuZFRvKGZvcm1Hcm91cCk7XHJcblx0XHRcdFx0XHRpbnB1dC5vbignZm9jdXMnLCBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdFx0XHRmb3JtR3JvdXAuZmluZCgnLnRvb2x0aXAnKS5yZW1vdmUoKTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0aW5wdXQub24oJ2tleWRvd24nLCBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdFx0XHRmb3JtR3JvdXAucmVtb3ZlQ2xhc3MoJ2Vycm9yJyk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdHZhbGlkID0gZmFsc2U7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGZvcm1Hcm91cC5yZW1vdmVDbGFzcygnZXJyb3InKTtcclxuXHRcdFx0XHRcdGZvcm1Hcm91cC5maW5kKCcudG9vbHRpcCcpLnJlbW92ZSgpO1xyXG5cdFx0XHRcdH07XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0dmFyIGNoZWNrR3JvdXAgPSAkKCcuZm9ybV9fY2hlY2tzJyksXHJcblx0XHRcdFx0dG9vbHRpcCA9ICQoJzxzcGFuIGNsYXNzPVwidG9vbHRpcFwiPtCg0L7QsdC+0YLQsNC8INGC0YPRgiDQvdC1INC80LXRgdGC0L48L3NwYW4+Jyk7XHJcblxyXG5cdFx0XHRpZiAoY2hlY2tzLmxlbmd0aCA+IDApIHtcclxuXHJcblx0XHRcdFx0aWYgKGNoZWNrc09rLmxlbmd0aCA8IDIpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdjaGVjayBzb21lb25lJyk7XHJcblx0XHRcdFx0XHRjaGVja0dyb3VwLmZpbmQoJy50b29sdGlwJykucmVtb3ZlKCk7XHJcblx0XHRcdFx0XHR0b29sdGlwLmFwcGVuZFRvKGNoZWNrR3JvdXApO1xyXG5cdFx0XHRcdFx0dmFsaWQgPSBmYWxzZTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Y2hlY2tHcm91cC5maW5kKCcudG9vbHRpcCcpLnJlbW92ZSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gdmFsaWQ7XHJcblx0XHR9XHJcblxyXG5cdH1cclxuXHJcblx0Zm9ybVZhbGlkYXRlLmRvaXQoKTtcclxufSgpKTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
