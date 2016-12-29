(function () {
  var showMenu = {

    init: function () {
      this.listeners();
    },

    listeners: function () {
      $('.hamburger').on('click', showMenu.openMenu);
    },

    openMenu: function (e) {
      e.preventDefault();
      $('.navigation').toggleClass('navigation-open');
      console.log('click');
      $('.hamburger').toggleClass('hamburger-cross');
      $('html').toggleClass('hide-scroll');
      $('body').toggleClass('hide-scroll');
    }
  }

  showMenu.init();
}());