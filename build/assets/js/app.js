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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XHJcblxyXG4oZnVuY3Rpb24oKSB7XHJcbiAgc3ZnNGV2ZXJ5Ym9keSgpO1xyXG5cclxuICAkKCcjYXV0aCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KXtcclxuICBcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgXHQkKCcjZmxpcCcpLnRvZ2dsZUNsYXNzKCdmbGlwJyk7XHJcbiAgXHQkKHRoaXMpLmhpZGUoKTtcclxuXHR9KTtcclxuXHQkKCcjZmxpcHJldHVybicpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KXtcclxuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHQkKCcjZmxpcCcpLnRvZ2dsZUNsYXNzKCdmbGlwJyk7XHJcblx0XHQkKCcjYXV0aCcpLnNob3coKTtcclxuXHR9KTtcclxuXHQkKCcjdG9nZ2xlbmF2Jykub24oJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpe1xyXG5cdFx0JCgnI25hdicpLnRvZ2dsZSgpO1xyXG5cdFx0JCgnI3RvZ2dsZW5hdicpLnRvZ2dsZUNsYXNzKCduYXZfX2hhbWJ1cmdlcl9jbG9zZScpO1xyXG5cdFx0JCgnaHRtbCcpLnRvZ2dsZUNsYXNzKCdoaWRlU2Nyb2xsJyk7XHJcblx0fSk7XHJcbiAgXHJcbn0pKCk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
