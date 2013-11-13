'use strict';

var app = angular.module('BEApp', [
    'ui.router',
    'ui.keypress',
    'ui.bootstrap',
    'BEApp.services',
    'BEApp.directives'
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

    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
  });