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