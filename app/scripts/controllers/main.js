'use strict';

angular.module('BEApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  })
  .controller('BlockCtrl', function ($scope) {
    $scope.tx = [
      '145698',
      '121354',
      '544566'
    ];
  })
  .controller('TxCtrl', function ($scope) {
    $scope.tx = {
      id : 145698,
      size: 258,
      relayed_by: "64.179.201.80"
    }
  });
