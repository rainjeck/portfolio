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