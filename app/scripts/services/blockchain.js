/**
 * Created by will on 11/14/13.
 */
'use strict'

services.factory('blockchain', [function () {
  var LATEST_HASH_URL = 'http://blockchain.info/q/latesthash',
    BLOCK_HASH_URL = 'http://blockchain.info/rawblock/';

  function getLatestHash() {
    return $http.get(LATEST_HASH_URL).
      success(function(data) {
        return data;
      }).
      error(function(data, status) {
        throw 'Error retrieving the lastest hash. Check log for details';
        console.log(status);
      })
  }

  return blocks;
}]);