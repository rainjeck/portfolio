'use strict';

var showMenu = (function (){
		$('#togglenav').on('click', function(event){
		$('#navTop').toggleClass('navigate-show');
		$('#togglenav').toggleClass('hamburger__icon-close');
		$('html').toggleClass('hideScroll');
	});
}());

var flip = (function(){
	$('#auth').on('click', function(event){
  	event.preventDefault();
  	$('#flip').addClass('flip');
  	$(this).css('visibility', 'hidden');
	});
	$('#flipreturn').on('click', function(event){
		event.preventDefault();
		$('#flip').removeClass('flip');
		$('#auth').css('visibility', 'visible');
	});
	
	// переворачиваем форму по клику вне формы
	$(document).mouseup(function (e) {
    var container = $('#flip'); // берем нашу форму
    if (container.has(e.target).length === 0){
        container.removeClass('flip');
        $('#auth').css('visibility', 'visible');
    }
	});

}());

var svg4everybody = (function(){
	svg4everybody();
}());