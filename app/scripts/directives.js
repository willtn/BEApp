'use strict';

var directives = angular.module('BEApp.directives', []);

directives.directive('infiniteScroll', function() {
  return function(scope, elm, attr) {
    var raw = elm[0];

    elm.bind('scroll', function() {
      if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
        scope.$apply(attr.infiniteScroll);
      }
    });
  };
});

directives.directive('expandPin', function() {

});

directives.directive('editableText', function() {
  return {
    link: function(scope, elm, attr) {
      scope.readOnly = true;

      var clickable = elm.find('a'),
        input = elm.find('input');

      clickable.bind('click', function() {
        scope.readOnly = false;
        scope.$apply();
        input[0].focus();
      });

      input.bind('blur', function() {
        scope.readOnly = true;
        scope.apply();
      });
    },
    replace: true,
    transclude: true,
    restrict: 'E',
    templateUrl: 'views/editable-text.html',
    /**
     * <editable-text value="value"></editable-text>
     * template:
     *   <div class="editable-text">
     *     <a ng-show="readOnly">
     *       {{value}}
     *     </a>
     *     <div ng-hide="readOnly">
     *       <input ng-model="value">
     *     </div>
     *   </div>
     */
    scope: {
      value: "@"
    }
  };
});