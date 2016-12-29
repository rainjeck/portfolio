(function () {
  // flip panel on welcome page
  var flipPanel = {

    init: function() {
      if ( document.querySelector('.flip-button') ) {
        this.listeners();
      }

    },

    listeners: function () {
      document.querySelector('.flip-button').addEventListener('click', flipPanel.flippingPanel);
      document.querySelector('.flip-return').addEventListener('click', flipPanel.flippingReturn);
    },

    flippingPanel: function (e) {
      e.preventDefault();
      document.forms["loginForm"].reset();
      document.querySelector('.flip-container').classList.add('flip');
      document.querySelector('.flip-button').classList.add('hide');
    },

    flippingReturn: function (e) {
      e.preventDefault();
      document.querySelector('.flip-container').classList.remove('flip');
      document.querySelector('.flip-button').classList.remove('hide');
    }
  }

  flipPanel.init();
}() );