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