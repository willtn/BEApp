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
directives.directive('expandPin', function(items) {
  return {
    restrict: 'E',
    scope: {
      obj: "=",
      header: "=",
      showing: "="
    },
    templateUrl: 'views/expand-pin.html',
    link: function(scope, elm) {
      if (scope.showing.showingId == scope.obj.id)
        scope.expandOn = true;
      else
        scope.expandOn = false;

      // Determine if the object is fully fetched
      if (scope.obj.hasOwnProperty('time')) {
        scope.fetched = true;
      }
      else {
        scope.fetched = false;
      }

      /*scope.$watch(scope.showing, function() {
        var transId = scope.obj.id;
        if (scope.showing.showing === false && scope.showing.showingId == false) {
          scope.expandOn = false;
        } else if (scope.showing.showing === true && scope.showing.showingId == transId) {
          scope.expandOn = true;
        } else if (scope.showing.showing === false && scope.showing.showingId != transId) {
          scope.expandOn = false;
        }

      });*/

      /**
       * Toogle details of a transaction. Fetch data if the transaction has not been fetched
       */
      scope.toogleExpand = function() {
        var transId = scope.obj.id;

        if (scope.fetched) {
          scope.expandOn = !scope.expandOn;
        }
        else {
          console.log('Fetch called', transId, items.selected.lTx[transId]);
          items.getTransaction(transId).then(function() {
            console.log('Fetched finished', items.selected.lTx[transId]);
            scope.fetched = true;
            scope.showing.showingId = transId;
          });
        }
      };

      /**
       * Generate an array of attributes of the object represented in this pin
       * @type {Array}
       */
      scope.attrList = [];
      for (var attr in scope.obj) {
        if (scope.obj.hasOwnProperty(attr) && attr != 'id' && attr != 'hash' && attr != '$$hashKey') {
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