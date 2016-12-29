var parallax = (function () {

  var
    background = document.querySelector('.header__bg'),
    userContainer = document.querySelector('.user'),
    iconContainer = document.querySelector('.header__svg');

  return {

    move: function (block,windowScroll,strafeAmount) {
      var strafe = windowScroll / -strafeAmount + '%';
      var transformString = 'translateY(' + strafe + ')';
      var style = block.style;
      style.transform = transformString;
      style.webkitTransform = transformString;
      style.top = strafe;
    },

    init: function(wScroll) {
      if (background) {
        this.move(background, wScroll, 60);
      }
      if (iconContainer) {
        this.move(iconContainer, wScroll, 30);
      }
      if (userContainer) {
        this.move(userContainer, wScroll, 20);
      }
    }
  }
}());

window.onscroll = function() {
  var wScroll = window.pageYOffset;
  parallax.init(wScroll);
};