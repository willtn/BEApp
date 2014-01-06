require.config({
  paths: {
  	jquery: '../bower_components/jquery/jquery',
  	angular: '../bower_components/angular/angular',
  	uiRouter: '../bower_components/angular-ui-router/release/angular-ui-router',
  	bootstrapModal: '../bower_components/bootstrap-sass/js/bootstrap-modal',
  	bootstrapButton: '../bower_components/bootstrap-sass/js/bootstrap-button',
  	uiBootstrap: 'lib/ui-bootstrap-tpls-0.6.0',
  	uiKeypress: 'lib/keypress'
  },
  shim: {
  	'jquery': {'exports': 'jquery'},
  	'angular': {'exports': 'angular'},
    'bootstrapModal': {'exports': 'bootstrapModal', 'deps': ['jquery']},
  	'uiBootstrap': {'exports': 'uiBootstrap', 'deps': ['angular']},
  	'uiKeypress': {'exports': 'uiKeypress', 'deps': ['angular']},
  	'uiRouter': {'exports': 'uiRouter', 'deps': ['angular']}
  },
  priority: [
  	"angular"
  ]
});

require([
  'angular',
  'app',
  'bootstrapModal'
], function(angular) {
  'use strict';
  angular.bootstrap(document, ['BEApp']);
});