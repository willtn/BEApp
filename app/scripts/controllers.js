'use strict';

angular.module('BEApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeStats = [
      'Block Mined: 200.00',
      'Time Between Blocks: 7.20 (minutes)',
      'Bitcoin Mined: 5,000 BTC',
      'No. of Transactions: 58829',
      'Total Output Volume: 1,176,216.42271571 BTC',
      'Estimated Transaction Volume: 431,868.90068598 BTC'
    ];
  })



  .controller('BlockCtrl', function ($scope, $stateParams, $modal, items) {
    $scope.block_id = $stateParams.block_id;
    $scope.block = items.selected;
    $scope.tx = $scope.block.l_tx;

    $scope.showingId = null;
    $scope.showing = false;

    $scope.toogleShowingTx = function(id) {
      if ($scope.showingId != id) {
        $scope.showingId = id;
        $scope.showing = true;
      }
      else {
        $scope.showingId = null;
        $scope.showing = false;
      }
    };

    $scope.modal = function(trans) {
      console.log(trans);
      $modal.open({
        templateUrl: 'views/tx.html',
        controller: TxCtrl,
        resolve: {
          tx: function () {return trans;}
          }
        }
      );
    }
  })



  .controller('AppController', function ($scope, $stateParams, $state, items, scroll) {
    $scope.items = items;

    $scope.goTo = function(id) {
      items.selectItem(id);
      $state.go('block', {block_id: items.selected.id});
    };

    $scope.goHome = function() {
      items.deselectItem();
      $state.go('main');
    };

    $scope.goTop = function() {
      items.selectItem(0);
      $state.go('block', {block_id: items.selected.id});
    };

    $scope.next = function() {
      console.log('next');
      items.next();
      $state.go('block', {block_id: items.selected.id});
    };

    $scope.prev = function() {
      console.log('prev')
      items.prev();
      $state.go('block', {block_id: items.selected.id});
    };

    $scope.handleSpace = function() {
      if (!scroll.pageDown()) {
        $scope.next();
      }
    };

    $scope.$watch('items.selectedIdx', function(newVal) {
      if (newVal !== null) scroll.toCurrent();
    });
  })

  .controller('NavBarCtrl', function($stateParams, items) {

  });

var TxCtrl = function($scope, $modalInstance, tx) {
  $scope.tx = tx;
  /*$scope.totalInput = function() {
    var totalValue = 0;
    tx.in.forEach(function(input) {
      console.log(input.value);
      totalValue += input.value;
    });
    return totalValue;
  };
  $scope.totalOutput = function() {
    var totalValue = 0;
    tx.out.forEach(function(output) {
      totalValue += output.value;
    });
    return totalValue;
  };*/

  $scope.ok = function () {
    $modalInstance.close();
  };
}