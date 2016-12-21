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

			var from,email,message;
			var pattern = /^[a-z0-9_-]+@[a-z0-9-]+\.([a-z]{1,6}\.)?[a-z]{2,6}$/i;
			from=$("#mailName").val();
			email=$("#mailMail").val();
			message=$("#mailMessage").val();
			if(email != ''){
				if(email.search(pattern) == 0){
					$("#mailMessage").text("Sending E-mail...Please wait");
					$.get("./send",{from:from,email:email,message:message},function(data){
						if(data=="sent") {
							$("#mailForm").html("<div>Email is been sent at "+from+" . Please check inbox !</div>");
						}
					});
				} else {
					$('input#mailMail').parents('.form__text').addClass('error');
					$('<span class="tooltip">Некорректрый email</span>').appendTo('.error');
				}
			}
			//var formdata = form.serialize();
			// $.ajax({
			// 	url: 'assets/php/mail-process.php',
			// 	type: 'POST',
			// 	data: formdata
			// })
			// .done(function(msg) {
			// 	if (msg === 'OK') {
			// 		console.log('OK');
			// 		form.trigger("reset");
			// 	} else {
			// 		$('input#mailMail').parents('.form__text').addClass('error');
			// 		$('<span class="tooltip">' + msg + '</span>').appendTo('.error');
			// 	}
			// })
			// .fail(function() {
			// 	console.log("error");
			// })
			// .always(function() {
			// 	console.log("complete");
			// });

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