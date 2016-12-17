// навигация в блоге

var checkSection = (function (){
	return {
		init: function() {
			$('.blog__post').each(function(i, el){
				var $this = $(this),
				topEdge = $this.offset().top - 70,
				bottomEdge = topEdge + $this.height(),
				wScroll = $(window).scrollTop();

				if (topEdge < wScroll && bottomEdge > wScroll) {
					var currentId = $this.data('section'),
						reqLink = $('.blog__nav__link').filter('[href = "#' + currentId + '"]');

					reqLink.closest('.blog__nav__item').addClass('active')
						.siblings().removeClass('active');
				}
			});
		}
	}
}());

$(window).scroll(function(){
	checkSection.init();
});