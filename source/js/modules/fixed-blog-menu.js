var fixedBlogMenu = (function () {

	return {
		moveMenu: function() {
			var wWidth = $(window).width();

				if ( wWidth > 768 ) {
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
		},
		swipeMenu: function(){
			$('.js-mobButton').on('click', function(e){

				$('.blog__nav').toggleClass('js-showMenu');
				$('.wrapper-blog').toggleClass('js-moveLeft');

			});
		}
	}

}()); // end main function

$(document).ready(function() {

	if ( $('.blog__nav') ) {

		fixedBlogMenu.swipeMenu();

		$(window).scroll(function(event) {
			fixedBlogMenu.moveMenu();
		});

		$(window).resize(function(event) {
			fixedBlogMenu.moveMenu();
		});

	}
});


