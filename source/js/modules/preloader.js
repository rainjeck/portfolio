var preloader = (function(){

  var percentsTotal = 1,
    preloader = $('.preloader');

  var imgPath = $('*').map(function(index, element) {
    var bground = $(element).css('background-image'),
      img = $(element).is('img'),
      path = '';

    if ( bground != 'none' ) {
      path = bground.replace('url("', '').replace('")', '');
    }

    if ( img ) {
      path = $(element).attr('src');
    }

    if ( path ) return path
  })

  var setPercents = function(total, current) {
    var percents = Math.ceil(current / total * 100);

    $('.preloader__percents').text(percents);

    if (percents >= 100) {
      preloader.fadeOut();
    }
  }

  var loadImages = function(images) {

    if( !images.length ) preloader.fadeOut();

    images.forEach(function(img, i, images) {
      var fakeImg = $('<img>', {
        attr : {
          src: img
        }
      });

      fakeImg.on('load error', function() {
        setPercents(images.length, percentsTotal);
        percentsTotal++;
      });
    });
  }

  return {
    init: function () {
      var imgs = imgPath.toArray();
      loadImages(imgs);
    }
  }

}());

$(function () {
  preloader.init();
});