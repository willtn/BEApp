/**
 * Created by will on 11/14/13.
 */
'use strict';

/**
 * Abstract Firebase storage service
 */
services.factory('blockStorage', [function(angularFire) {
  var _url = null,
    _ref = null;
  return {
    init: function (url){
      _url = url;
      _ref = new Firebase(_url);
    },
    setToScope: function (scope, localScopeVarName) {
      angularFire(_ref, scope, localScopeVarName);
    }
  }
}]);