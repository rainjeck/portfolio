var blur = function () {
  var wrapper = document.querySelector('.blur__wrapper'),
    form = document.querySelector('.blur__form');

  return function() {
      if (wrapper, form) {
        var imgWidth = document.querySelector('.blur__background').offsetWidth,
          posLeft = -wrapper.offsetLeft,
          posTop = -wrapper.offsetTop,
          blurCSS = form.style;

        blurCSS.backgroundSize = imgWidth + 'px ' + 'auto';
        blurCSS.backgroundPosition = posLeft + 'px ' + posTop + 'px';
      }
    }
};

var makeBlur = blur();

makeBlur();

window.onresize = function () {
  makeBlur();
};