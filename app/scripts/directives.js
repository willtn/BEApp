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

/**
 * <expand-pin obj="obj" header="obj.header"></expand-pin>
 */
directives.directive('expandPin', function() {
  return {
    restrict: 'E',
    scope: {
      obj: "=",
      header: "="
    },
    templateUrl: 'views/expand-pin.html',
    link: function(scope, elm) {
      scope.expandOn = false;

      scope.toogleExpand = function() {
        scope.expandOn = !scope.expandOn;
      };

      scope.attrList = [];
      for (var attr in scope.obj) {
        if (scope.obj.hasOwnProperty(attr) && attr != 'hash' && attr != '$$hashKey') {
          scope.attrList.push(attr);
        }
      };
    }
  };
});

/**
 * <editable-text ng-model="value"></editable-text>
 */
directives.directive('editableText', function() {
  return {
    link: function(scope, elm) {
      scope.readOnly = true;

      var input = elm.find('input');
      scope.toogleEdit = function() {
        scope.readOnly = !scope.readOnly;
      };
    },
    restrict: 'E',
    templateUrl: 'views/editable-text.html',
    scope: {
      value: "=ngModel"
    }
  };
});