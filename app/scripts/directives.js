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