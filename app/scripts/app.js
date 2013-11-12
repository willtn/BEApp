'use strict';

var app = angular.module('BEApp', [
    'ui.router',
    'BEApp.directives',
    'BEApp.filters',
    'BEApp.services'
]);

app.config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
    $urlRouterProvider.otherwise("/");

    $stateProvider
      .state('main', {
        url: "/",
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .state('block',{
        url: "/block/:block_id",
        templateUrl: 'views/block.html',
        controller: 'BlockCtrl'
      })
      .state('tx', {
        url: "/tx",
        //url: "/block/:block_id/tx/:tx_id",
        templateUrl: 'views/tx.html',
        controller: 'TxCtrl'
      });

    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
  });