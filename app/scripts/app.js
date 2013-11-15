'use strict';

var app = angular.module('BEApp', [
    'ui.router',
    'ui.keypress',
    'ui.bootstrap',
    'firebase',
    'BEApp.services',
    'BEApp.directives',
    'BEApp.bc'
  ]);

app.config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
    $urlRouterProvider.otherwise('/');

    //TODO: Handling accesses by URLs
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .state('block',{
        url: '/block/:block_id',
        templateUrl: 'views/block.html',
        controller: 'BlockCtrl'
      })
      .state('404', {
        url:'/404',
        templateUrl: '404.html'
      });
  });