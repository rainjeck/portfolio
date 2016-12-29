'use strict';
var svg4everybody = (function(){
  svg4everybody();
}());
(function () {

  var blogMenu = {
    init: function () {
      this.listeners();
    },

    listeners: function () {
      $(window).scroll(function() {
        if ( $(window).width() > 768 ) {
          blogMenu.follow(70);
          blogMenu.sticky();
        } else {
          blogMenu.follow(200);
        };
      });

      $('.js-mobButton').on('click', blogMenu.swipe);
    },

    follow: function (edge) {
      $('.blog-post').each(function(i, el) {
        var $this = $(this),
          topEdge = $this.offset().top - edge,
          bottomEdge = topEdge + $this.height(),
          windowScroll = $(window).scrollTop();

        if ( topEdge < windowScroll && bottomEdge > windowScroll ) {
          var currentId = $this.data('section'),
            reqLink = $('.blog-nav__link').filter('[href = "#' + currentId + '"]');

          reqLink.closest('.blog-nav__item').addClass('active')
            .siblings().removeClass('active');
        }
      });
    },

    sticky: function () {
      var menuWidth = $('.blog-nav').width(),
        windowScroll = $(window).scrollTop(),
        offset = $('.blog__navigate').offset(),
        menu = $('.blog-nav');

      if ( (offset.top - 70) < windowScroll ) {
        menu.addClass('blog-nav-fixed');
        menu.css({width: menuWidth, left: offset.left + 9});
      } else {
        menu.removeClass('blog-nav-fixed');
        menu.removeAttr('style');
      }
    },

    swipe: function (e) {
      e.preventDefault();
      $('.blog__navigate').toggleClass('js-showMenu');
      $('.wrapper-blog').toggleClass('js-moveLeft');
    }

  } // .var

  if ( $('#blogPage').length ) {
    blogMenu.init();
  }

}());
var blur = function () {
  var wrapper = document.querySelector('.blur__wrapper'),
    form = document.querySelector('.blur__form');

  return function() {
      if (wrapper, form) {
        var imgWidth = document.querySelector('.blur__background').offsetWidth,
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
(function () {
  // flip panel on welcome page
  var flipPanel = {

    init: function() {
      if ( document.querySelector('.flip-button') ) {
        this.listeners();
      }

    },

    listeners: function () {
      document.querySelector('.flip-button').addEventListener('click', flipPanel.flippingPanel);
      document.querySelector('.flip-return').addEventListener('click', flipPanel.flippingReturn);
    },

    flippingPanel: function (e) {
      e.preventDefault();
      document.forms["loginForm"].reset();
      document.querySelector('.flip-container').classList.add('flip');
      document.querySelector('.flip-button').classList.add('hide');
    },

    flippingReturn: function (e) {
      e.preventDefault();
      document.querySelector('.flip-container').classList.remove('flip');
      document.querySelector('.flip-button').classList.remove('hide');
    }
  }

  flipPanel.init();
}() );
var parallax = (function () {

  var
    background = document.querySelector('.header__bg'),
    userContainer = document.querySelector('.user'),
    iconContainer = document.querySelector('.header__svg');

  return {

    move: function (block,windowScroll,strafeAmount) {
      var strafe = windowScroll / -strafeAmount + '%';
      var transformString = 'translateY(' + strafe + ')';
      var style = block.style;
      style.transform = transformString;
      style.webkitTransform = transformString;
      style.top = strafe;
    },

    init: function(wScroll) {
      if (background) {
        this.move(background, wScroll, 60);
      }
      if (iconContainer) {
        this.move(iconContainer, wScroll, 30);
      }
      if (userContainer) {
        this.move(userContainer, wScroll, 20);
      }
    }
  }
}());

window.onscroll = function() {
  var wScroll = window.pageYOffset;
  parallax.init(wScroll);
};
var preloader = (function(){

  var percentsTotal = 1,
    preloader = $('.preloader');

  var imgPath = $('*').map(function(index, element) {
    var bground = $(element).css('background-image'),
      img = $(element).is('img'),
      path = '';

    if ( bground != 'none' ) {
      path = bground.replace('url("', '').replace('")', '');
    }

    if ( img ) {
      path = $(element).attr('src');
    }

    if ( path ) return path
  })

  var setPercents = function(total, current) {
    var percents = Math.ceil(current / total * 100);

    $('.preloader__percents').text(percents);

    if (percents >= 100) {
      preloader.fadeOut();
    }
  }

  var loadImages = function(images) {

    if( !images.length ) preloader.fadeOut();

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

}());

$(function () {
  preloader.init();
});
(function () {
  var showMenu = {

    init: function () {
      this.listeners();
    },

    listeners: function () {
      $('.hamburger').on('click', showMenu.openMenu);
    },

    openMenu: function (e) {
      e.preventDefault();
      $('.navigation').toggleClass('navigation-open');
      console.log('click');
      $('.hamburger').toggleClass('hamburger-cross');
      $('html').toggleClass('hide-scroll');
      $('body').toggleClass('hide-scroll');
    }
  }

  showMenu.init();
}());
var slider = (function() {
  return {
    init: function() {

      var
        _this = this,
        sliderItemActive = $('.slider__item').first().addClass('active');

      _this.makeDots();

      $('.slider__btn').on('click', function(e) {
        e.preventDefault();

        var
          $this = $(this),
          items = $this.closest('.slider__container').find('.slider__item'),
          activeItem = items.filter('.active'),
          nextItem = activeItem.next(),
          prevItem = activeItem.prev(),
          firstItem = items.first(),
          lastSlide = items.last;

        if( $this.hasClass('slider__btn-next') ) {

          if ( nextItem.length ) {
            _this.moveSlide(nextItem);
          } else {
            _this.moveSlide(firstItem);
          }

        } else {
          if ( prevItem.length ) {
            _this.moveSlide(prevItem);
          } else {
            _this.moveSlide(lastItem);
          }
        }
      });

      $('.slider__dots').on('click', '.slider__dot', function(e) {
        e.preventDefault();
        var
          $this = $(this),
          dotClick = $this.index(),
          slide = $('.slider__item'),
          activeItem = slide.filter('.active');

        if ( activeItem.index() < dotClick ) {
          _this.moveSlide(slide.eq(dotClick));
        } else {
          _this.moveSlide(slide.eq(dotClick));
        }
      })
    },

    moveSlide: function(slide) {
      var
        _this = this,
        container = slide.closest('.slider__container'),
        items = container.find('.slider__item'),
        active = items.filter('.active');

      items.addClass('hideSlide').removeClass('active showSlide');
      slide.removeClass('hideSlide').addClass('active showSlide');

      _this.activeDot(container.find('.slider__dots'));
    },

    makeDots: function () {
      var
        _this = this,
        container = $('.slider__container'),
        dotHtml = '<li class="slider__dot"><button class="slider__btn-dot"></button></li>';

      container.each(function() {
        var
          $this = $(this),
          items = $this.find('.slider__item'),
          dotContainer = $this.find('.slider__dots');

        for ( var i = 0; i < items.size(); i++ ) {
          dotContainer.append(dotHtml);
        }

        _this.activeDot(dotContainer);
      });
    },

    activeDot: function(container) {
      var items = container.closest('.slider__container').find('.slider__item');

      container
        .find('.slider__dot')
        .eq(items.filter('.active').index())
        .addClass('active')
        .siblings()
        .removeClass('active');
    }
  }
}());

if ( $('.slider__container') ) {
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
      var headerHeight = $('#screen').position().top;
      $('body').animate({scrollTop: headerHeight}, 1000);
      console.log(headerHeight);
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

    doit: function() {
      this.listeners();
    },

    listeners: function() {
      $('#mailForm').on('submit', formValidate.sendMail);
      $('#loginForm').on('submit', formValidate.loginValid);
      $('.form-reset').on('click', formValidate.clearForm);
    },

    loginValid: function(e) {
      e.preventDefault();
      var form = $(this);
      if ( formValidate.valid(form) === false ) return false;

      console.log('come in');
    },

    sendMail: function(e) {
      e.preventDefault();
      var form = $(this);
      if ( formValidate.valid(form) === false ) return false;

      var
        from,email,message,data,
        pattern = /^[a-z0-9_-]+@[a-z0-9-]+\.([a-z]{1,6}\.)?[a-z]{2,6}$/i,
        from=$("#mailName").val(),
        email=$("#mailEmail").val(),
        message=$("#mailMessage").val(),
        data = form.serialize();

      if( email != '' ) {
        if( email.search(pattern) == 0  ) {
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
          $('input#mailEmail').parents('.form__group').addClass('error');
          $('<span class="form__tooltip">Некорректрый email</span>').appendTo('.error');
        }
      }
    },

    valid: function(form) {
      var
        inputs = form.find('input, textarea'),
        checks = form.find('input:checkbox, input:radio'),
        checked = form.find('input:checked'),
        valid = true;

      $.each(inputs, function(index, val) {
        var
          input = $(val),
          val = input.val(),
          formGroup = input.parents('.form__group'),
          label = formGroup.find('label').text().toLowerCase(),
          textError = 'Вы не ввели ' + label,
          tooltip = $('<span class="form__tooltip">' + textError + '</span>');

        if ( val.length === 0 ) {
          formGroup.addClass('error');
          formGroup.find('.form__tooltip').remove();
          tooltip.appendTo(formGroup);
          input.on('focus', function(){
            formGroup.find('.form__tooltip').remove();
          });
          input.on('keydown', function() {
            formGroup.removeClass('error');
          });
          valid = false;
        } else {
          formGroup.removeClass('error');
          formGroup.find('.form__tooltip').remove();
        };
      });

      var
        checkGroup = $('.form__group-radio'),
        tooltip = $('<span class="form__tooltip">Роботам тут не место</span>');

      if ( checks.length > 0 ) {

        if ( checked.length < 2 ) {
          checkGroup.find('.form__tooltip').remove();
          tooltip.appendTo(checkGroup);
          valid = false;
          checks.on('click', function(){
            checkGroup.find('.form__tooltip').remove();
          });
        } else {
          checkGroup.find('.form__tooltip').remove();
        }
      }
      return valid;
    },

    clearForm: function (e) {
      e.preventDefault();
      $('.form__tooltip').remove();
      $('.form__group').removeClass('error');
      $('form')[0].reset();
    }

  }

  formValidate.doit();
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImJsb2dNZW51LmpzIiwiYmx1ci5qcyIsImZsaXAuanMiLCJwYXJhbGxheC5qcyIsInByZWxvYWRlci5qcyIsInNob3dNZW51LmpzIiwic2xpZGVyLmpzIiwic21vb3Roc2Nyb29sLmpzIiwidmFsaWRhdGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XHJcbnZhciBzdmc0ZXZlcnlib2R5ID0gKGZ1bmN0aW9uKCl7XHJcbiAgc3ZnNGV2ZXJ5Ym9keSgpO1xyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcblxyXG4gIHZhciBibG9nTWVudSA9IHtcclxuICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdGhpcy5saXN0ZW5lcnMoKTtcclxuICAgIH0sXHJcblxyXG4gICAgbGlzdGVuZXJzOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICQod2luZG93KS5zY3JvbGwoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKCAkKHdpbmRvdykud2lkdGgoKSA+IDc2OCApIHtcclxuICAgICAgICAgIGJsb2dNZW51LmZvbGxvdyg3MCk7XHJcbiAgICAgICAgICBibG9nTWVudS5zdGlja3koKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgYmxvZ01lbnUuZm9sbG93KDIwMCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICAkKCcuanMtbW9iQnV0dG9uJykub24oJ2NsaWNrJywgYmxvZ01lbnUuc3dpcGUpO1xyXG4gICAgfSxcclxuXHJcbiAgICBmb2xsb3c6IGZ1bmN0aW9uIChlZGdlKSB7XHJcbiAgICAgICQoJy5ibG9nLXBvc3QnKS5lYWNoKGZ1bmN0aW9uKGksIGVsKSB7XHJcbiAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKSxcclxuICAgICAgICAgIHRvcEVkZ2UgPSAkdGhpcy5vZmZzZXQoKS50b3AgLSBlZGdlLFxyXG4gICAgICAgICAgYm90dG9tRWRnZSA9IHRvcEVkZ2UgKyAkdGhpcy5oZWlnaHQoKSxcclxuICAgICAgICAgIHdpbmRvd1Njcm9sbCA9ICQod2luZG93KS5zY3JvbGxUb3AoKTtcclxuXHJcbiAgICAgICAgaWYgKCB0b3BFZGdlIDwgd2luZG93U2Nyb2xsICYmIGJvdHRvbUVkZ2UgPiB3aW5kb3dTY3JvbGwgKSB7XHJcbiAgICAgICAgICB2YXIgY3VycmVudElkID0gJHRoaXMuZGF0YSgnc2VjdGlvbicpLFxyXG4gICAgICAgICAgICByZXFMaW5rID0gJCgnLmJsb2ctbmF2X19saW5rJykuZmlsdGVyKCdbaHJlZiA9IFwiIycgKyBjdXJyZW50SWQgKyAnXCJdJyk7XHJcblxyXG4gICAgICAgICAgcmVxTGluay5jbG9zZXN0KCcuYmxvZy1uYXZfX2l0ZW0nKS5hZGRDbGFzcygnYWN0aXZlJylcclxuICAgICAgICAgICAgLnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIHN0aWNreTogZnVuY3Rpb24gKCkge1xyXG4gICAgICB2YXIgbWVudVdpZHRoID0gJCgnLmJsb2ctbmF2Jykud2lkdGgoKSxcclxuICAgICAgICB3aW5kb3dTY3JvbGwgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCksXHJcbiAgICAgICAgb2Zmc2V0ID0gJCgnLmJsb2dfX25hdmlnYXRlJykub2Zmc2V0KCksXHJcbiAgICAgICAgbWVudSA9ICQoJy5ibG9nLW5hdicpO1xyXG5cclxuICAgICAgaWYgKCAob2Zmc2V0LnRvcCAtIDcwKSA8IHdpbmRvd1Njcm9sbCApIHtcclxuICAgICAgICBtZW51LmFkZENsYXNzKCdibG9nLW5hdi1maXhlZCcpO1xyXG4gICAgICAgIG1lbnUuY3NzKHt3aWR0aDogbWVudVdpZHRoLCBsZWZ0OiBvZmZzZXQubGVmdCArIDl9KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBtZW51LnJlbW92ZUNsYXNzKCdibG9nLW5hdi1maXhlZCcpO1xyXG4gICAgICAgIG1lbnUucmVtb3ZlQXR0cignc3R5bGUnKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBzd2lwZTogZnVuY3Rpb24gKGUpIHtcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAkKCcuYmxvZ19fbmF2aWdhdGUnKS50b2dnbGVDbGFzcygnanMtc2hvd01lbnUnKTtcclxuICAgICAgJCgnLndyYXBwZXItYmxvZycpLnRvZ2dsZUNsYXNzKCdqcy1tb3ZlTGVmdCcpO1xyXG4gICAgfVxyXG5cclxuICB9IC8vIC52YXJcclxuXHJcbiAgaWYgKCAkKCcjYmxvZ1BhZ2UnKS5sZW5ndGggKSB7XHJcbiAgICBibG9nTWVudS5pbml0KCk7XHJcbiAgfVxyXG5cclxufSgpKTsiLCJ2YXIgYmx1ciA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgd3JhcHBlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5ibHVyX193cmFwcGVyJyksXHJcbiAgICBmb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJsdXJfX2Zvcm0nKTtcclxuXHJcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xyXG4gICAgICBpZiAod3JhcHBlciwgZm9ybSkge1xyXG4gICAgICAgIHZhciBpbWdXaWR0aCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5ibHVyX19iYWNrZ3JvdW5kJykub2Zmc2V0V2lkdGgsXHJcbiAgICAgICAgICBwb3NMZWZ0ID0gLXdyYXBwZXIub2Zmc2V0TGVmdCxcclxuICAgICAgICAgIHBvc1RvcCA9IC13cmFwcGVyLm9mZnNldFRvcCxcclxuICAgICAgICAgIGJsdXJDU1MgPSBmb3JtLnN0eWxlO1xyXG5cclxuICAgICAgICBibHVyQ1NTLmJhY2tncm91bmRTaXplID0gaW1nV2lkdGggKyAncHggJyArICdhdXRvJztcclxuICAgICAgICBibHVyQ1NTLmJhY2tncm91bmRQb3NpdGlvbiA9IHBvc0xlZnQgKyAncHggJyArIHBvc1RvcCArICdweCc7XHJcbiAgICAgIH1cclxuICAgIH1cclxufTtcclxuXHJcbnZhciBtYWtlQmx1ciA9IGJsdXIoKTtcclxuXHJcbm1ha2VCbHVyKCk7XHJcblxyXG53aW5kb3cub25yZXNpemUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgbWFrZUJsdXIoKTtcclxufTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gIC8vIGZsaXAgcGFuZWwgb24gd2VsY29tZSBwYWdlXHJcbiAgdmFyIGZsaXBQYW5lbCA9IHtcclxuXHJcbiAgICBpbml0OiBmdW5jdGlvbigpIHtcclxuICAgICAgaWYgKCBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZmxpcC1idXR0b24nKSApIHtcclxuICAgICAgICB0aGlzLmxpc3RlbmVycygpO1xyXG4gICAgICB9XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICBsaXN0ZW5lcnM6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZsaXAtYnV0dG9uJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmbGlwUGFuZWwuZmxpcHBpbmdQYW5lbCk7XHJcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mbGlwLXJldHVybicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZmxpcFBhbmVsLmZsaXBwaW5nUmV0dXJuKTtcclxuICAgIH0sXHJcblxyXG4gICAgZmxpcHBpbmdQYW5lbDogZnVuY3Rpb24gKGUpIHtcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBkb2N1bWVudC5mb3Jtc1tcImxvZ2luRm9ybVwiXS5yZXNldCgpO1xyXG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZmxpcC1jb250YWluZXInKS5jbGFzc0xpc3QuYWRkKCdmbGlwJyk7XHJcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mbGlwLWJ1dHRvbicpLmNsYXNzTGlzdC5hZGQoJ2hpZGUnKTtcclxuICAgIH0sXHJcblxyXG4gICAgZmxpcHBpbmdSZXR1cm46IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZsaXAtY29udGFpbmVyJykuY2xhc3NMaXN0LnJlbW92ZSgnZmxpcCcpO1xyXG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZmxpcC1idXR0b24nKS5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmbGlwUGFuZWwuaW5pdCgpO1xyXG59KCkgKTsiLCJ2YXIgcGFyYWxsYXggPSAoZnVuY3Rpb24gKCkge1xyXG5cclxuICB2YXJcclxuICAgIGJhY2tncm91bmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19iZycpLFxyXG4gICAgdXNlckNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy51c2VyJyksXHJcbiAgICBpY29uQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fc3ZnJyk7XHJcblxyXG4gIHJldHVybiB7XHJcblxyXG4gICAgbW92ZTogZnVuY3Rpb24gKGJsb2NrLHdpbmRvd1Njcm9sbCxzdHJhZmVBbW91bnQpIHtcclxuICAgICAgdmFyIHN0cmFmZSA9IHdpbmRvd1Njcm9sbCAvIC1zdHJhZmVBbW91bnQgKyAnJSc7XHJcbiAgICAgIHZhciB0cmFuc2Zvcm1TdHJpbmcgPSAndHJhbnNsYXRlWSgnICsgc3RyYWZlICsgJyknO1xyXG4gICAgICB2YXIgc3R5bGUgPSBibG9jay5zdHlsZTtcclxuICAgICAgc3R5bGUudHJhbnNmb3JtID0gdHJhbnNmb3JtU3RyaW5nO1xyXG4gICAgICBzdHlsZS53ZWJraXRUcmFuc2Zvcm0gPSB0cmFuc2Zvcm1TdHJpbmc7XHJcbiAgICAgIHN0eWxlLnRvcCA9IHN0cmFmZTtcclxuICAgIH0sXHJcblxyXG4gICAgaW5pdDogZnVuY3Rpb24od1Njcm9sbCkge1xyXG4gICAgICBpZiAoYmFja2dyb3VuZCkge1xyXG4gICAgICAgIHRoaXMubW92ZShiYWNrZ3JvdW5kLCB3U2Nyb2xsLCA2MCk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGljb25Db250YWluZXIpIHtcclxuICAgICAgICB0aGlzLm1vdmUoaWNvbkNvbnRhaW5lciwgd1Njcm9sbCwgMzApO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh1c2VyQ29udGFpbmVyKSB7XHJcbiAgICAgICAgdGhpcy5tb3ZlKHVzZXJDb250YWluZXIsIHdTY3JvbGwsIDIwKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufSgpKTtcclxuXHJcbndpbmRvdy5vbnNjcm9sbCA9IGZ1bmN0aW9uKCkge1xyXG4gIHZhciB3U2Nyb2xsID0gd2luZG93LnBhZ2VZT2Zmc2V0O1xyXG4gIHBhcmFsbGF4LmluaXQod1Njcm9sbCk7XHJcbn07IiwidmFyIHByZWxvYWRlciA9IChmdW5jdGlvbigpe1xyXG5cclxuICB2YXIgcGVyY2VudHNUb3RhbCA9IDEsXHJcbiAgICBwcmVsb2FkZXIgPSAkKCcucHJlbG9hZGVyJyk7XHJcblxyXG4gIHZhciBpbWdQYXRoID0gJCgnKicpLm1hcChmdW5jdGlvbihpbmRleCwgZWxlbWVudCkge1xyXG4gICAgdmFyIGJncm91bmQgPSAkKGVsZW1lbnQpLmNzcygnYmFja2dyb3VuZC1pbWFnZScpLFxyXG4gICAgICBpbWcgPSAkKGVsZW1lbnQpLmlzKCdpbWcnKSxcclxuICAgICAgcGF0aCA9ICcnO1xyXG5cclxuICAgIGlmICggYmdyb3VuZCAhPSAnbm9uZScgKSB7XHJcbiAgICAgIHBhdGggPSBiZ3JvdW5kLnJlcGxhY2UoJ3VybChcIicsICcnKS5yZXBsYWNlKCdcIiknLCAnJyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCBpbWcgKSB7XHJcbiAgICAgIHBhdGggPSAkKGVsZW1lbnQpLmF0dHIoJ3NyYycpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICggcGF0aCApIHJldHVybiBwYXRoXHJcbiAgfSlcclxuXHJcbiAgdmFyIHNldFBlcmNlbnRzID0gZnVuY3Rpb24odG90YWwsIGN1cnJlbnQpIHtcclxuICAgIHZhciBwZXJjZW50cyA9IE1hdGguY2VpbChjdXJyZW50IC8gdG90YWwgKiAxMDApO1xyXG5cclxuICAgICQoJy5wcmVsb2FkZXJfX3BlcmNlbnRzJykudGV4dChwZXJjZW50cyk7XHJcblxyXG4gICAgaWYgKHBlcmNlbnRzID49IDEwMCkge1xyXG4gICAgICBwcmVsb2FkZXIuZmFkZU91dCgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdmFyIGxvYWRJbWFnZXMgPSBmdW5jdGlvbihpbWFnZXMpIHtcclxuXHJcbiAgICBpZiggIWltYWdlcy5sZW5ndGggKSBwcmVsb2FkZXIuZmFkZU91dCgpO1xyXG5cclxuICAgIGltYWdlcy5mb3JFYWNoKGZ1bmN0aW9uKGltZywgaSwgaW1hZ2VzKSB7XHJcbiAgICAgIHZhciBmYWtlSW1nID0gJCgnPGltZz4nLCB7XHJcbiAgICAgICAgYXR0ciA6IHtcclxuICAgICAgICAgIHNyYzogaW1nXHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGZha2VJbWcub24oJ2xvYWQgZXJyb3InLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBzZXRQZXJjZW50cyhpbWFnZXMubGVuZ3RoLCBwZXJjZW50c1RvdGFsKTtcclxuICAgICAgICBwZXJjZW50c1RvdGFsKys7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgaW5pdDogZnVuY3Rpb24gKCkge1xyXG4gICAgICB2YXIgaW1ncyA9IGltZ1BhdGgudG9BcnJheSgpO1xyXG4gICAgICBsb2FkSW1hZ2VzKGltZ3MpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbn0oKSk7XHJcblxyXG4kKGZ1bmN0aW9uICgpIHtcclxuICBwcmVsb2FkZXIuaW5pdCgpO1xyXG59KTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gIHZhciBzaG93TWVudSA9IHtcclxuXHJcbiAgICBpbml0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHRoaXMubGlzdGVuZXJzKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIGxpc3RlbmVyczogZnVuY3Rpb24gKCkge1xyXG4gICAgICAkKCcuaGFtYnVyZ2VyJykub24oJ2NsaWNrJywgc2hvd01lbnUub3Blbk1lbnUpO1xyXG4gICAgfSxcclxuXHJcbiAgICBvcGVuTWVudTogZnVuY3Rpb24gKGUpIHtcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAkKCcubmF2aWdhdGlvbicpLnRvZ2dsZUNsYXNzKCduYXZpZ2F0aW9uLW9wZW4nKTtcclxuICAgICAgY29uc29sZS5sb2coJ2NsaWNrJyk7XHJcbiAgICAgICQoJy5oYW1idXJnZXInKS50b2dnbGVDbGFzcygnaGFtYnVyZ2VyLWNyb3NzJyk7XHJcbiAgICAgICQoJ2h0bWwnKS50b2dnbGVDbGFzcygnaGlkZS1zY3JvbGwnKTtcclxuICAgICAgJCgnYm9keScpLnRvZ2dsZUNsYXNzKCdoaWRlLXNjcm9sbCcpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc2hvd01lbnUuaW5pdCgpO1xyXG59KCkpOyIsInZhciBzbGlkZXIgPSAoZnVuY3Rpb24oKSB7XHJcbiAgcmV0dXJuIHtcclxuICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgdmFyXHJcbiAgICAgICAgX3RoaXMgPSB0aGlzLFxyXG4gICAgICAgIHNsaWRlckl0ZW1BY3RpdmUgPSAkKCcuc2xpZGVyX19pdGVtJykuZmlyc3QoKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcblxyXG4gICAgICBfdGhpcy5tYWtlRG90cygpO1xyXG5cclxuICAgICAgJCgnLnNsaWRlcl9fYnRuJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgdmFyXHJcbiAgICAgICAgICAkdGhpcyA9ICQodGhpcyksXHJcbiAgICAgICAgICBpdGVtcyA9ICR0aGlzLmNsb3Nlc3QoJy5zbGlkZXJfX2NvbnRhaW5lcicpLmZpbmQoJy5zbGlkZXJfX2l0ZW0nKSxcclxuICAgICAgICAgIGFjdGl2ZUl0ZW0gPSBpdGVtcy5maWx0ZXIoJy5hY3RpdmUnKSxcclxuICAgICAgICAgIG5leHRJdGVtID0gYWN0aXZlSXRlbS5uZXh0KCksXHJcbiAgICAgICAgICBwcmV2SXRlbSA9IGFjdGl2ZUl0ZW0ucHJldigpLFxyXG4gICAgICAgICAgZmlyc3RJdGVtID0gaXRlbXMuZmlyc3QoKSxcclxuICAgICAgICAgIGxhc3RTbGlkZSA9IGl0ZW1zLmxhc3Q7XHJcblxyXG4gICAgICAgIGlmKCAkdGhpcy5oYXNDbGFzcygnc2xpZGVyX19idG4tbmV4dCcpICkge1xyXG5cclxuICAgICAgICAgIGlmICggbmV4dEl0ZW0ubGVuZ3RoICkge1xyXG4gICAgICAgICAgICBfdGhpcy5tb3ZlU2xpZGUobmV4dEl0ZW0pO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgX3RoaXMubW92ZVNsaWRlKGZpcnN0SXRlbSk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBpZiAoIHByZXZJdGVtLmxlbmd0aCApIHtcclxuICAgICAgICAgICAgX3RoaXMubW92ZVNsaWRlKHByZXZJdGVtKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIF90aGlzLm1vdmVTbGlkZShsYXN0SXRlbSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgICQoJy5zbGlkZXJfX2RvdHMnKS5vbignY2xpY2snLCAnLnNsaWRlcl9fZG90JywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB2YXJcclxuICAgICAgICAgICR0aGlzID0gJCh0aGlzKSxcclxuICAgICAgICAgIGRvdENsaWNrID0gJHRoaXMuaW5kZXgoKSxcclxuICAgICAgICAgIHNsaWRlID0gJCgnLnNsaWRlcl9faXRlbScpLFxyXG4gICAgICAgICAgYWN0aXZlSXRlbSA9IHNsaWRlLmZpbHRlcignLmFjdGl2ZScpO1xyXG5cclxuICAgICAgICBpZiAoIGFjdGl2ZUl0ZW0uaW5kZXgoKSA8IGRvdENsaWNrICkge1xyXG4gICAgICAgICAgX3RoaXMubW92ZVNsaWRlKHNsaWRlLmVxKGRvdENsaWNrKSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIF90aGlzLm1vdmVTbGlkZShzbGlkZS5lcShkb3RDbGljaykpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIH0sXHJcblxyXG4gICAgbW92ZVNsaWRlOiBmdW5jdGlvbihzbGlkZSkge1xyXG4gICAgICB2YXJcclxuICAgICAgICBfdGhpcyA9IHRoaXMsXHJcbiAgICAgICAgY29udGFpbmVyID0gc2xpZGUuY2xvc2VzdCgnLnNsaWRlcl9fY29udGFpbmVyJyksXHJcbiAgICAgICAgaXRlbXMgPSBjb250YWluZXIuZmluZCgnLnNsaWRlcl9faXRlbScpLFxyXG4gICAgICAgIGFjdGl2ZSA9IGl0ZW1zLmZpbHRlcignLmFjdGl2ZScpO1xyXG5cclxuICAgICAgaXRlbXMuYWRkQ2xhc3MoJ2hpZGVTbGlkZScpLnJlbW92ZUNsYXNzKCdhY3RpdmUgc2hvd1NsaWRlJyk7XHJcbiAgICAgIHNsaWRlLnJlbW92ZUNsYXNzKCdoaWRlU2xpZGUnKS5hZGRDbGFzcygnYWN0aXZlIHNob3dTbGlkZScpO1xyXG5cclxuICAgICAgX3RoaXMuYWN0aXZlRG90KGNvbnRhaW5lci5maW5kKCcuc2xpZGVyX19kb3RzJykpO1xyXG4gICAgfSxcclxuXHJcbiAgICBtYWtlRG90czogZnVuY3Rpb24gKCkge1xyXG4gICAgICB2YXJcclxuICAgICAgICBfdGhpcyA9IHRoaXMsXHJcbiAgICAgICAgY29udGFpbmVyID0gJCgnLnNsaWRlcl9fY29udGFpbmVyJyksXHJcbiAgICAgICAgZG90SHRtbCA9ICc8bGkgY2xhc3M9XCJzbGlkZXJfX2RvdFwiPjxidXR0b24gY2xhc3M9XCJzbGlkZXJfX2J0bi1kb3RcIj48L2J1dHRvbj48L2xpPic7XHJcblxyXG4gICAgICBjb250YWluZXIuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXJcclxuICAgICAgICAgICR0aGlzID0gJCh0aGlzKSxcclxuICAgICAgICAgIGl0ZW1zID0gJHRoaXMuZmluZCgnLnNsaWRlcl9faXRlbScpLFxyXG4gICAgICAgICAgZG90Q29udGFpbmVyID0gJHRoaXMuZmluZCgnLnNsaWRlcl9fZG90cycpO1xyXG5cclxuICAgICAgICBmb3IgKCB2YXIgaSA9IDA7IGkgPCBpdGVtcy5zaXplKCk7IGkrKyApIHtcclxuICAgICAgICAgIGRvdENvbnRhaW5lci5hcHBlbmQoZG90SHRtbCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBfdGhpcy5hY3RpdmVEb3QoZG90Q29udGFpbmVyKTtcclxuICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGFjdGl2ZURvdDogZnVuY3Rpb24oY29udGFpbmVyKSB7XHJcbiAgICAgIHZhciBpdGVtcyA9IGNvbnRhaW5lci5jbG9zZXN0KCcuc2xpZGVyX19jb250YWluZXInKS5maW5kKCcuc2xpZGVyX19pdGVtJyk7XHJcblxyXG4gICAgICBjb250YWluZXJcclxuICAgICAgICAuZmluZCgnLnNsaWRlcl9fZG90JylcclxuICAgICAgICAuZXEoaXRlbXMuZmlsdGVyKCcuYWN0aXZlJykuaW5kZXgoKSlcclxuICAgICAgICAuYWRkQ2xhc3MoJ2FjdGl2ZScpXHJcbiAgICAgICAgLnNpYmxpbmdzKClcclxuICAgICAgICAucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgfVxyXG4gIH1cclxufSgpKTtcclxuXHJcbmlmICggJCgnLnNsaWRlcl9fY29udGFpbmVyJykgKSB7XHJcbiAgICBzbGlkZXIuaW5pdCgpO1xyXG59IiwiKGZ1bmN0aW9uKCl7XHJcbiAgdmFyIHNtb3Roc2Nyb2xsID0ge1xyXG4gICAgZG9pdDogZnVuY3Rpb24oKXtcclxuICAgICAgdGhpcy5saXN0ZW5lcnMoKTtcclxuICAgIH0sXHJcblxyXG4gICAgbGlzdGVuZXJzOiBmdW5jdGlvbigpe1xyXG4gICAgICAkKCcjYXJyb3dEb3duJykub24oJ2NsaWNrJywgc21vdGhzY3JvbGwuc2Nyb2xsRG93bik7XHJcbiAgICAgICQoJyNhcnJvd1VwJykub24oJ2NsaWNrJywgc21vdGhzY3JvbGwuc2Nyb2xsVXApO1xyXG4gICAgfSxcclxuXHJcbiAgICBzY3JvbGxEb3duOiBmdW5jdGlvbihlKXtcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICB2YXIgaGVhZGVySGVpZ2h0ID0gJCgnI3NjcmVlbicpLnBvc2l0aW9uKCkudG9wO1xyXG4gICAgICAkKCdib2R5JykuYW5pbWF0ZSh7c2Nyb2xsVG9wOiBoZWFkZXJIZWlnaHR9LCAxMDAwKTtcclxuICAgICAgY29uc29sZS5sb2coaGVhZGVySGVpZ2h0KTtcclxuICAgIH0sXHJcblxyXG4gICAgc2Nyb2xsVXA6IGZ1bmN0aW9uKGUpe1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICQoJ2JvZHknKS5hbmltYXRlKHtzY3JvbGxUb3A6IDB9LCAyMDAwKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHNtb3Roc2Nyb2xsLmRvaXQoKTtcclxufSgpKTsiLCIoZnVuY3Rpb24oKXtcclxuICB2YXIgZm9ybVZhbGlkYXRlID0ge1xyXG5cclxuICAgIGRvaXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICB0aGlzLmxpc3RlbmVycygpO1xyXG4gICAgfSxcclxuXHJcbiAgICBsaXN0ZW5lcnM6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAkKCcjbWFpbEZvcm0nKS5vbignc3VibWl0JywgZm9ybVZhbGlkYXRlLnNlbmRNYWlsKTtcclxuICAgICAgJCgnI2xvZ2luRm9ybScpLm9uKCdzdWJtaXQnLCBmb3JtVmFsaWRhdGUubG9naW5WYWxpZCk7XHJcbiAgICAgICQoJy5mb3JtLXJlc2V0Jykub24oJ2NsaWNrJywgZm9ybVZhbGlkYXRlLmNsZWFyRm9ybSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGxvZ2luVmFsaWQ6IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICB2YXIgZm9ybSA9ICQodGhpcyk7XHJcbiAgICAgIGlmICggZm9ybVZhbGlkYXRlLnZhbGlkKGZvcm0pID09PSBmYWxzZSApIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgIGNvbnNvbGUubG9nKCdjb21lIGluJyk7XHJcbiAgICB9LFxyXG5cclxuICAgIHNlbmRNYWlsOiBmdW5jdGlvbihlKSB7XHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgdmFyIGZvcm0gPSAkKHRoaXMpO1xyXG4gICAgICBpZiAoIGZvcm1WYWxpZGF0ZS52YWxpZChmb3JtKSA9PT0gZmFsc2UgKSByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgICB2YXJcclxuICAgICAgICBmcm9tLGVtYWlsLG1lc3NhZ2UsZGF0YSxcclxuICAgICAgICBwYXR0ZXJuID0gL15bYS16MC05Xy1dK0BbYS16MC05LV0rXFwuKFthLXpdezEsNn1cXC4pP1thLXpdezIsNn0kL2ksXHJcbiAgICAgICAgZnJvbT0kKFwiI21haWxOYW1lXCIpLnZhbCgpLFxyXG4gICAgICAgIGVtYWlsPSQoXCIjbWFpbEVtYWlsXCIpLnZhbCgpLFxyXG4gICAgICAgIG1lc3NhZ2U9JChcIiNtYWlsTWVzc2FnZVwiKS52YWwoKSxcclxuICAgICAgICBkYXRhID0gZm9ybS5zZXJpYWxpemUoKTtcclxuXHJcbiAgICAgIGlmKCBlbWFpbCAhPSAnJyApIHtcclxuICAgICAgICBpZiggZW1haWwuc2VhcmNoKHBhdHRlcm4pID09IDAgICkge1xyXG4gICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdXJsOiAnL3NlbmQnLFxyXG4gICAgICAgICAgICB0eXBlOiAnUE9TVCcsXHJcbiAgICAgICAgICAgIGRhdGE6IGRhdGFcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuZG9uZShmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdWNjZXNzXCIpO1xyXG4gICAgICAgICAgICBmb3JtLnNsaWRlVXAoMjAwKTtcclxuICAgICAgICAgICAgJCgnLndpbmRvd19fbWVudScpLmhpZGUoKTtcclxuICAgICAgICAgICAgJCgnLmZvcm1fX3N1Y2NlcycpLnNob3coKTtcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuZmFpbChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvclwiKTtcclxuICAgICAgICAgICAgZm9ybS5zbGlkZVVwKDIwMCk7XHJcbiAgICAgICAgICAgICQoJy53aW5kb3dfX21lbnUnKS5oaWRlKCk7XHJcbiAgICAgICAgICAgICQoJy5mb3JtX19lcnJvcicpLnNob3coKTtcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICQoJ2lucHV0I21haWxFbWFpbCcpLnBhcmVudHMoJy5mb3JtX19ncm91cCcpLmFkZENsYXNzKCdlcnJvcicpO1xyXG4gICAgICAgICAgJCgnPHNwYW4gY2xhc3M9XCJmb3JtX190b29sdGlwXCI+0J3QtdC60L7RgNGA0LXQutGC0YDRi9C5IGVtYWlsPC9zcGFuPicpLmFwcGVuZFRvKCcuZXJyb3InKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgdmFsaWQ6IGZ1bmN0aW9uKGZvcm0pIHtcclxuICAgICAgdmFyXHJcbiAgICAgICAgaW5wdXRzID0gZm9ybS5maW5kKCdpbnB1dCwgdGV4dGFyZWEnKSxcclxuICAgICAgICBjaGVja3MgPSBmb3JtLmZpbmQoJ2lucHV0OmNoZWNrYm94LCBpbnB1dDpyYWRpbycpLFxyXG4gICAgICAgIGNoZWNrZWQgPSBmb3JtLmZpbmQoJ2lucHV0OmNoZWNrZWQnKSxcclxuICAgICAgICB2YWxpZCA9IHRydWU7XHJcblxyXG4gICAgICAkLmVhY2goaW5wdXRzLCBmdW5jdGlvbihpbmRleCwgdmFsKSB7XHJcbiAgICAgICAgdmFyXHJcbiAgICAgICAgICBpbnB1dCA9ICQodmFsKSxcclxuICAgICAgICAgIHZhbCA9IGlucHV0LnZhbCgpLFxyXG4gICAgICAgICAgZm9ybUdyb3VwID0gaW5wdXQucGFyZW50cygnLmZvcm1fX2dyb3VwJyksXHJcbiAgICAgICAgICBsYWJlbCA9IGZvcm1Hcm91cC5maW5kKCdsYWJlbCcpLnRleHQoKS50b0xvd2VyQ2FzZSgpLFxyXG4gICAgICAgICAgdGV4dEVycm9yID0gJ9CS0Ysg0L3QtSDQstCy0LXQu9C4ICcgKyBsYWJlbCxcclxuICAgICAgICAgIHRvb2x0aXAgPSAkKCc8c3BhbiBjbGFzcz1cImZvcm1fX3Rvb2x0aXBcIj4nICsgdGV4dEVycm9yICsgJzwvc3Bhbj4nKTtcclxuXHJcbiAgICAgICAgaWYgKCB2YWwubGVuZ3RoID09PSAwICkge1xyXG4gICAgICAgICAgZm9ybUdyb3VwLmFkZENsYXNzKCdlcnJvcicpO1xyXG4gICAgICAgICAgZm9ybUdyb3VwLmZpbmQoJy5mb3JtX190b29sdGlwJykucmVtb3ZlKCk7XHJcbiAgICAgICAgICB0b29sdGlwLmFwcGVuZFRvKGZvcm1Hcm91cCk7XHJcbiAgICAgICAgICBpbnB1dC5vbignZm9jdXMnLCBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICBmb3JtR3JvdXAuZmluZCgnLmZvcm1fX3Rvb2x0aXAnKS5yZW1vdmUoKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgaW5wdXQub24oJ2tleWRvd24nLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgZm9ybUdyb3VwLnJlbW92ZUNsYXNzKCdlcnJvcicpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICB2YWxpZCA9IGZhbHNlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBmb3JtR3JvdXAucmVtb3ZlQ2xhc3MoJ2Vycm9yJyk7XHJcbiAgICAgICAgICBmb3JtR3JvdXAuZmluZCgnLmZvcm1fX3Rvb2x0aXAnKS5yZW1vdmUoKTtcclxuICAgICAgICB9O1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHZhclxyXG4gICAgICAgIGNoZWNrR3JvdXAgPSAkKCcuZm9ybV9fZ3JvdXAtcmFkaW8nKSxcclxuICAgICAgICB0b29sdGlwID0gJCgnPHNwYW4gY2xhc3M9XCJmb3JtX190b29sdGlwXCI+0KDQvtCx0L7RgtCw0Lwg0YLRg9GCINC90LUg0LzQtdGB0YLQvjwvc3Bhbj4nKTtcclxuXHJcbiAgICAgIGlmICggY2hlY2tzLmxlbmd0aCA+IDAgKSB7XHJcblxyXG4gICAgICAgIGlmICggY2hlY2tlZC5sZW5ndGggPCAyICkge1xyXG4gICAgICAgICAgY2hlY2tHcm91cC5maW5kKCcuZm9ybV9fdG9vbHRpcCcpLnJlbW92ZSgpO1xyXG4gICAgICAgICAgdG9vbHRpcC5hcHBlbmRUbyhjaGVja0dyb3VwKTtcclxuICAgICAgICAgIHZhbGlkID0gZmFsc2U7XHJcbiAgICAgICAgICBjaGVja3Mub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgY2hlY2tHcm91cC5maW5kKCcuZm9ybV9fdG9vbHRpcCcpLnJlbW92ZSgpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNoZWNrR3JvdXAuZmluZCgnLmZvcm1fX3Rvb2x0aXAnKS5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHZhbGlkO1xyXG4gICAgfSxcclxuXHJcbiAgICBjbGVhckZvcm06IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgJCgnLmZvcm1fX3Rvb2x0aXAnKS5yZW1vdmUoKTtcclxuICAgICAgJCgnLmZvcm1fX2dyb3VwJykucmVtb3ZlQ2xhc3MoJ2Vycm9yJyk7XHJcbiAgICAgICQoJ2Zvcm0nKVswXS5yZXNldCgpO1xyXG4gICAgfVxyXG5cclxuICB9XHJcblxyXG4gIGZvcm1WYWxpZGF0ZS5kb2l0KCk7XHJcbn0oKSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
