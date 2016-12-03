(function() {
  'use strict';
  //svg4everybody();
  $('#auth').on('click', function(){
  	event.preventDefault();
  	$('#flip').toggleClass('flip');
	});
	$('#flipreturn').on('click', function(){
		event.preventDefault();
		$('#flip').toggleClass('flip');
	});
	$('#togglenav').on('click', function(){
		$('#nav').toggle();
		$('#togglenav').toggleClass('nav__hamburger_close');
		$('html').toggleClass('hideScroll');
	});
})();