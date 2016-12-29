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