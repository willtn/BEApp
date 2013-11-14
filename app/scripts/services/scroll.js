/**
 * Service that is in charge of scrolling in the app.
 */
//TODO: still need to rename the DOM objects
services.factory('scroll', function($timeout) {
  return {
    pageDown: function() {
      var itemHeight = $('.wrapper.active').height() + 60;
      var winHeight = $(window).height();
      var curScroll = $('.entries').scrollTop();
      var scroll = curScroll + winHeight;

      if (scroll < itemHeight) {
        $('.entries').scrollTop(scroll);
        return true;
      }

      // already at the bottom
      return false;
    },

    toCurrent: function() {
      // Need the setTimeout to prevent race condition with item being selected.
      $timeout(function() {
        var curScrollPos = $('.blocks').scrollTop();
        var itemTop = $('.block.active').offset().top - 60;
        $('.blocks').animate({'scrollTop': curScrollPos + itemTop}, 200);
      }, 0, false);
    }
  };
});