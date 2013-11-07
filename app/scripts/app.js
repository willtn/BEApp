'use strict';

var app = angular.module('BEApp', [
    'ui.router'
])
  .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
    $urlRouterProvider.otherwise("/");

    $stateProvider
      .state('main', {
        url: "/",
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .state('block',{
        url: "/block",
        templateUrl: 'views/block.html',
        controller: 'BlockCtrl'
      })
      .state('tx', {
        url: "/block/tx",
        templateUrl: 'views/tx.html',
        controller: 'TxCtrl'
      });

    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
  });

function AppController($scope, items, scroll) {

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
}

function NavBarController($scope, items) {

  $scope.showAll = function() {
    items.clearFilter();
  };

  $scope.showUnread = function() {
    items.filterBy('read', false);
  };

  $scope.showStarred = function() {
    items.filterBy('starred', true);
  };

  $scope.showRead = function() {
    items.filterBy('read', true);
  };
}