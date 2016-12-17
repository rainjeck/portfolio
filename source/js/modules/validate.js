var formValidate = ( function() {

	var form = $('form'),
		valid = true;

	var validate = function(e) {
		var inputs = form.find('input, textarea');

		$.each(inputs, function(index, val) {
			var input = $(val),
				val = input.val(),
				formGroup = input.parent(),
				label = formGroup.find('label').text().toLowerCase(),
				textError = 'Вы не ввели ' + label,
				tooltip = $('<span class="tooltip">' + textError + '</span>'),
				tooltipRobot = $('<span class="tooltip">Роботам тут не место</span>');

			 if( val.length === 0 ) {
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

			 } // if
			 else{
				formGroup.removeClass('error');
				formGroup.find('.tooltip').remove();

				if($("form input[type='radio']").is(':checked') && $("form input[type='checkbox']").is(':checked')) {
					$('.form__radiogroup').find('.tooltip').remove();
					$("form input[type='radio'], form input[type='checkbox']").on('click', function() {
						$('.form__radiogroup').find('.tooltip').remove();
					});
				} else {
					$('.form__radiogroup').find('.tooltip').remove();
					tooltipRobot.appendTo($('.form__radiogroup'));
				}
			} // else

			if($("form input[type='radio']").is(':checked') && $("form input[type='checkbox']").is(':checked')) {
				$('.form__radiogroup').find('.tooltip').remove();
				$("form input[type='radio'], form input[type='checkbox']").on('click', function() {
					$('.form__radiogroup').find('.tooltip').remove();
				});
				valid = true;
			} else {
				$('.form__radiogroup').find('.tooltip').remove();
				tooltipRobot.appendTo($('.form__radiogroup'));
			}
		}); // each
		return valid;
	};

	var startValidate = function(e) {
		e.preventDefault();
		validate();
		if (valid === false) return false;

		console.log('go ajax');
	}

	var submitForm = function(e) {
		form.on('submit', startValidate);
	};

	return {
		init: function() {
			submitForm();
		}
	}
}());

formValidate.init();