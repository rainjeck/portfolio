'use strict';

(function() {
  svg4everybody();

  $('#auth').on('click', function(event){
  	event.preventDefault();
  	$('#flip').toggleClass('flip');
  	$(this).hide();
	});
	$('#flipreturn').on('click', function(event){
		event.preventDefault();
		$('#flip').toggleClass('flip');
		$('#auth').show();
	});
	$('#togglenav').on('click', function(event){
		$('#nav').toggle();
		$('#togglenav').toggleClass('nav__hamburger_close');
		$('html').toggleClass('hideScroll');
	});
  
})();