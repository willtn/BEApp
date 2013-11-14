/**
 * Created by will on 11/14/13.
 */
var services = angular.module('BEApp.services', []);

services.config(['$httpProvider', function($httpProvider) {
  delete $httpProvider.defaults.headers.common["X-Requested-With"];
}]);