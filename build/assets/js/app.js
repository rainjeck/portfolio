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
var blur = (function () {
	var wrapper = document.querySelector('.blur__wrapper'),
		form = document.querySelector('.blur__form');

	return {
		set: function() {
			if (wrapper, form) {
				var imgWidth = document.querySelector('.blur__background').offsetWidth,
					posLeft = -wrapper.offsetLeft,
					posTop = -wrapper.offsetTop,
					blurCSS = form.style;

				blurCSS.backgroundSize = imgWidth + 'px ' + 'auto';
				blurCSS.backgroundPosition = posLeft + 'px ' + posTop + 'px';
			}
		}
	}
}());

blur.set();

window.onresize = function () {
	blur.set();
};
// создаем паралакс
var parallax = (function () {

	// берем элементы, которые будем двигать

	// берем блок с картинкой
	var doc = document,
		bg = doc.querySelector('.header__picture'),
		// блок с юзером
		user = doc.querySelector('.header__user'),
		// блок с Portfolio
		sectionText = doc.querySelector('.header__icon');

	// возвращаем результат функции
	return {
		move: function (block,windowScroll,strafeAmount) {
			// block - какой блок двигаем
			// windowScroll - на сколько пролистали страницу
			// strafeAmount - коэффециент, на который будем делить для скорости

			// вычисляем значение для движения в процентах
			var strafe = windowScroll / -strafeAmount + '%';

			// переключаем нагрузку на видеокарту
			var transformString = 'translate3d(0,' + strafe + ',0)';

			// добавляем стиль к нашему блоку
			var style = block.style;

			// используем transform для смещения
			// в этом случае просчет осуществляется только один раз, что снижает нагрузку
			style.transform = transformString;
			style.webkitTransform = transformString;

			// присваиваем значению 'top' переменную strafe - это будет процент смещения
			style.top = strafe;

		},


		init: function(wScroll) {
			// двигаем 'bg' в зависимости от 'wScroll' и задаем коэффициет (чем он больше, тем медленнее двигается)
			this.move(bg, wScroll, 60);
			this.move(sectionText, wScroll, 30);
			this.move(user, wScroll, 50);
		}
	}
}());

window.onscroll = function() {
	// узнаем на сколько прокрутили страницу
	var wScroll = window.pageYOffset;

	// вызываем parallax по скроллу
	parallax.init(wScroll);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImJsdXIuanMiLCJwYXJhbGF4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgc2hvd01lbnUgPSAoZnVuY3Rpb24gKCl7XHJcblx0XHQkKCcjdG9nZ2xlbmF2Jykub24oJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpe1xyXG5cdFx0JCgnI25hdlRvcCcpLnRvZ2dsZUNsYXNzKCduYXZpZ2F0ZS1zaG93Jyk7XHJcblx0XHQkKCcjdG9nZ2xlbmF2JykudG9nZ2xlQ2xhc3MoJ2hhbWJ1cmdlcl9faWNvbi1jbG9zZScpO1xyXG5cdFx0JCgnaHRtbCcpLnRvZ2dsZUNsYXNzKCdoaWRlU2Nyb2xsJyk7XHJcblx0fSk7XHJcbn0oKSk7XHJcblxyXG52YXIgZmxpcCA9IChmdW5jdGlvbigpe1xyXG5cdCQoJyNhdXRoJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpe1xyXG4gIFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICBcdCQoJyNmbGlwJykuYWRkQ2xhc3MoJ2ZsaXAnKTtcclxuICBcdCQodGhpcykuY3NzKCd2aXNpYmlsaXR5JywgJ2hpZGRlbicpO1xyXG5cdH0pO1xyXG5cdCQoJyNmbGlwcmV0dXJuJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpe1xyXG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHRcdCQoJyNmbGlwJykucmVtb3ZlQ2xhc3MoJ2ZsaXAnKTtcclxuXHRcdCQoJyNhdXRoJykuY3NzKCd2aXNpYmlsaXR5JywgJ3Zpc2libGUnKTtcclxuXHR9KTtcclxuXHRcclxuXHQvLyDQv9C10YDQtdCy0L7RgNCw0YfQuNCy0LDQtdC8INGE0L7RgNC80YMg0L/QviDQutC70LjQutGDINCy0L3QtSDRhNC+0YDQvNGLXHJcblx0JChkb2N1bWVudCkubW91c2V1cChmdW5jdGlvbiAoZSkge1xyXG4gICAgdmFyIGNvbnRhaW5lciA9ICQoJyNmbGlwJyk7IC8vINCx0LXRgNC10Lwg0L3QsNGI0YMg0YTQvtGA0LzRg1xyXG4gICAgaWYgKGNvbnRhaW5lci5oYXMoZS50YXJnZXQpLmxlbmd0aCA9PT0gMCl7XHJcbiAgICAgICAgY29udGFpbmVyLnJlbW92ZUNsYXNzKCdmbGlwJyk7XHJcbiAgICAgICAgJCgnI2F1dGgnKS5jc3MoJ3Zpc2liaWxpdHknLCAndmlzaWJsZScpO1xyXG4gICAgfVxyXG5cdH0pO1xyXG5cclxufSgpKTtcclxuXHJcbnZhciBzdmc0ZXZlcnlib2R5ID0gKGZ1bmN0aW9uKCl7XHJcblx0c3ZnNGV2ZXJ5Ym9keSgpO1xyXG59KCkpOyIsInZhciBibHVyID0gKGZ1bmN0aW9uICgpIHtcclxuXHR2YXIgd3JhcHBlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5ibHVyX193cmFwcGVyJyksXHJcblx0XHRmb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJsdXJfX2Zvcm0nKTtcclxuXHJcblx0cmV0dXJuIHtcclxuXHRcdHNldDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdGlmICh3cmFwcGVyLCBmb3JtKSB7XHJcblx0XHRcdFx0dmFyIGltZ1dpZHRoID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJsdXJfX2JhY2tncm91bmQnKS5vZmZzZXRXaWR0aCxcclxuXHRcdFx0XHRcdHBvc0xlZnQgPSAtd3JhcHBlci5vZmZzZXRMZWZ0LFxyXG5cdFx0XHRcdFx0cG9zVG9wID0gLXdyYXBwZXIub2Zmc2V0VG9wLFxyXG5cdFx0XHRcdFx0Ymx1ckNTUyA9IGZvcm0uc3R5bGU7XHJcblxyXG5cdFx0XHRcdGJsdXJDU1MuYmFja2dyb3VuZFNpemUgPSBpbWdXaWR0aCArICdweCAnICsgJ2F1dG8nO1xyXG5cdFx0XHRcdGJsdXJDU1MuYmFja2dyb3VuZFBvc2l0aW9uID0gcG9zTGVmdCArICdweCAnICsgcG9zVG9wICsgJ3B4JztcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxufSgpKTtcclxuXHJcbmJsdXIuc2V0KCk7XHJcblxyXG53aW5kb3cub25yZXNpemUgPSBmdW5jdGlvbiAoKSB7XHJcblx0Ymx1ci5zZXQoKTtcclxufTsiLCIvLyDRgdC+0LfQtNCw0LXQvCDQv9Cw0YDQsNC70LDQutGBXHJcbnZhciBwYXJhbGxheCA9IChmdW5jdGlvbiAoKSB7XHJcblxyXG5cdC8vINCx0LXRgNC10Lwg0Y3Qu9C10LzQtdC90YLRiywg0LrQvtGC0L7RgNGL0LUg0LHRg9C00LXQvCDQtNCy0LjQs9Cw0YLRjFxyXG5cclxuXHQvLyDQsdC10YDQtdC8INCx0LvQvtC6INGBINC60LDRgNGC0LjQvdC60L7QuVxyXG5cdHZhciBkb2MgPSBkb2N1bWVudCxcclxuXHRcdGJnID0gZG9jLnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX3BpY3R1cmUnKSxcclxuXHRcdC8vINCx0LvQvtC6INGBINGO0LfQtdGA0L7QvFxyXG5cdFx0dXNlciA9IGRvYy5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX191c2VyJyksXHJcblx0XHQvLyDQsdC70L7QuiDRgSBQb3J0Zm9saW9cclxuXHRcdHNlY3Rpb25UZXh0ID0gZG9jLnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX2ljb24nKTtcclxuXHJcblx0Ly8g0LLQvtC30LLRgNCw0YnQsNC10Lwg0YDQtdC30YPQu9GM0YLQsNGCINGE0YPQvdC60YbQuNC4XHJcblx0cmV0dXJuIHtcclxuXHRcdG1vdmU6IGZ1bmN0aW9uIChibG9jayx3aW5kb3dTY3JvbGwsc3RyYWZlQW1vdW50KSB7XHJcblx0XHRcdC8vIGJsb2NrIC0g0LrQsNC60L7QuSDQsdC70L7QuiDQtNCy0LjQs9Cw0LXQvFxyXG5cdFx0XHQvLyB3aW5kb3dTY3JvbGwgLSDQvdCwINGB0LrQvtC70YzQutC+INC/0YDQvtC70LjRgdGC0LDQu9C4INGB0YLRgNCw0L3QuNGG0YNcclxuXHRcdFx0Ly8gc3RyYWZlQW1vdW50IC0g0LrQvtGN0YTRhNC10YbQuNC10L3Rgiwg0L3QsCDQutC+0YLQvtGA0YvQuSDQsdGD0LTQtdC8INC00LXQu9C40YLRjCDQtNC70Y8g0YHQutC+0YDQvtGB0YLQuFxyXG5cclxuXHRcdFx0Ly8g0LLRi9GH0LjRgdC70Y/QtdC8INC30L3QsNGH0LXQvdC40LUg0LTQu9GPINC00LLQuNC20LXQvdC40Y8g0LIg0L/RgNC+0YbQtdC90YLQsNGFXHJcblx0XHRcdHZhciBzdHJhZmUgPSB3aW5kb3dTY3JvbGwgLyAtc3RyYWZlQW1vdW50ICsgJyUnO1xyXG5cclxuXHRcdFx0Ly8g0L/QtdGA0LXQutC70Y7Rh9Cw0LXQvCDQvdCw0LPRgNGD0LfQutGDINC90LAg0LLQuNC00LXQvtC60LDRgNGC0YNcclxuXHRcdFx0dmFyIHRyYW5zZm9ybVN0cmluZyA9ICd0cmFuc2xhdGUzZCgwLCcgKyBzdHJhZmUgKyAnLDApJztcclxuXHJcblx0XHRcdC8vINC00L7QsdCw0LLQu9GP0LXQvCDRgdGC0LjQu9GMINC6INC90LDRiNC10LzRgyDQsdC70L7QutGDXHJcblx0XHRcdHZhciBzdHlsZSA9IGJsb2NrLnN0eWxlO1xyXG5cclxuXHRcdFx0Ly8g0LjRgdC/0L7Qu9GM0LfRg9C10LwgdHJhbnNmb3JtINC00LvRjyDRgdC80LXRidC10L3QuNGPXHJcblx0XHRcdC8vINCyINGN0YLQvtC8INGB0LvRg9GH0LDQtSDQv9GA0L7RgdGH0LXRgiDQvtGB0YPRidC10YHRgtCy0LvRj9C10YLRgdGPINGC0L7Qu9GM0LrQviDQvtC00LjQvSDRgNCw0LcsINGH0YLQviDRgdC90LjQttCw0LXRgiDQvdCw0LPRgNGD0LfQutGDXHJcblx0XHRcdHN0eWxlLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVN0cmluZztcclxuXHRcdFx0c3R5bGUud2Via2l0VHJhbnNmb3JtID0gdHJhbnNmb3JtU3RyaW5nO1xyXG5cclxuXHRcdFx0Ly8g0L/RgNC40YHQstCw0LjQstCw0LXQvCDQt9C90LDRh9C10L3QuNGOICd0b3AnINC/0LXRgNC10LzQtdC90L3Rg9GOIHN0cmFmZSAtINGN0YLQviDQsdGD0LTQtdGCINC/0YDQvtGG0LXQvdGCINGB0LzQtdGJ0LXQvdC40Y9cclxuXHRcdFx0c3R5bGUudG9wID0gc3RyYWZlO1xyXG5cclxuXHRcdH0sXHJcblxyXG5cclxuXHRcdGluaXQ6IGZ1bmN0aW9uKHdTY3JvbGwpIHtcclxuXHRcdFx0Ly8g0LTQstC40LPQsNC10LwgJ2JnJyDQsiDQt9Cw0LLQuNGB0LjQvNC+0YHRgtC4INC+0YIgJ3dTY3JvbGwnINC4INC30LDQtNCw0LXQvCDQutC+0Y3RhNGE0LjRhtC40LXRgiAo0YfQtdC8INC+0L0g0LHQvtC70YzRiNC1LCDRgtC10Lwg0LzQtdC00LvQtdC90L3QtdC1INC00LLQuNCz0LDQtdGC0YHRjylcclxuXHRcdFx0dGhpcy5tb3ZlKGJnLCB3U2Nyb2xsLCA2MCk7XHJcblx0XHRcdHRoaXMubW92ZShzZWN0aW9uVGV4dCwgd1Njcm9sbCwgMzApO1xyXG5cdFx0XHR0aGlzLm1vdmUodXNlciwgd1Njcm9sbCwgNTApO1xyXG5cdFx0fVxyXG5cdH1cclxufSgpKTtcclxuXHJcbndpbmRvdy5vbnNjcm9sbCA9IGZ1bmN0aW9uKCkge1xyXG5cdC8vINGD0LfQvdCw0LXQvCDQvdCwINGB0LrQvtC70YzQutC+INC/0YDQvtC60YDRg9GC0LjQu9C4INGB0YLRgNCw0L3QuNGG0YNcclxuXHR2YXIgd1Njcm9sbCA9IHdpbmRvdy5wYWdlWU9mZnNldDtcclxuXHJcblx0Ly8g0LLRi9C30YvQstCw0LXQvCBwYXJhbGxheCDQv9C+INGB0LrRgNC+0LvQu9GDXHJcblx0cGFyYWxsYXguaW5pdCh3U2Nyb2xsKTtcclxufTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
