'use strict';

var app = angular.module('BEApp', [
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/block/:id',{
        templateUrl: 'views/block.html',
        controller: 'BlockCtrl'
      })
      .when('/block/transactions/:id', {
        templateUrl: 'views/tx.html',
        controller: 'TxCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
