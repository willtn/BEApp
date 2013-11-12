'use strict';

angular.module('BEApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  })

  .controller('BlockCtrl', function ($scope, $stateParams, items) {
    items.all.forEach(function(item) {
      if (item.id == $stateParams.block_id) {
        $scope.block = item;
      }
    });
    $scope.tx = $scope.block.l_tx;
  })

  .controller('TxCtrl', function ($scope) {
    $scope.tx = {
      id : 145698,
      size: 258,
      relayed_by: "64.179.201.80"
    }
  })

  .controller('AppController', function ($scope, items, scroll) {
    $scope.items = items;

    $scope.refresh = function() {

    };

    $scope.handleSpace = function() {
      if (!scroll.pageDown()) {
        items.next();
      }
    };

    $scope.$watch('items.selectedIdx', function(newVal) {
      if (newVal !== null) scroll.toCurrent();
    });
  })

  .controller('NavBarController', function(items) {

  });