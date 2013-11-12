var directives = angular.module('BEApp.directives', []);

directives.directive('keyDown', function() {
  return function(scope, elm, attr) {
    elm.bind('keyDown', function(e) {
      switch (e.keyCode) {
        case 34: // PgDn
        case 39: // right arrow
        case 40: // down arrow
        case 74: // j
          return scope.$apply(attr.wDown);

        case 32: // Space
          e.preventDefault();
          return scope.$apply(attr.wSpace);

        case 33: // PgUp
        case 37: // left arrow
        case 38: // up arrow
        case 75: // k
          return scope.$apply(attr.wUp);
      }
    });
  };
});


/**
 * Component that handles rendering a post content in an iframe. the post content is data-bound into the component via
 * the src attribute.
 *
 * example usage:
 * <w-content src="post.content"><w-content>
 */
directives.directive('wContent', function() {
  return {
    restrict: 'E',
    template: '<iframe src="post-content.html" seamless class="post-content"></iframe>',
    link: function($scope, $element, attrs) {
      var iframeWindow = $element.find('iframe')[0].contentWindow;

      $scope.$watch(attrs.src, function(content) {
        iframeWindow.postMessage({type: 'loadContent', content: content}, '*');
      });

      window.addEventListener('message', function(event) {
        if (event.data.type != 'openUrl') return;

        var linkElem = angular.element('<a href="' + event.data.url + '" target="_blank"></a>')[0],
          event = document.createEvent('MouseEvents');

        event.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, linkElem);
        linkElem.dispatchEvent(event);
      }, false);
    }
  }
});