/**
 * Created by will on 11/14/13.
 */
'use strict'
var bcModule = angular.module('BEApp.bc', []);

bcModule.config(['$httpProvider', function($httpProvider) {
  delete $httpProvider.defaults.headers.common["X-Requested-With"];
}]);

bcModule.factory('bcQuery', function ($http, $q, $rootScope) {
  var LATEST_HASH_URL = 'http://blockchain.info/q/latesthash',
    BLOCK_HASH_URL = 'http://blockchain.info/rawblock/';

  /**
   * Generate the URL for the given block hash
   * @param hash
   * @returns {string}
   */
  function getHashURL(hash) {
    return BLOCK_HASH_URL + hash + '?format=json&cors=true';
  }

  /**
   * Transform requested data into a block
   * @param data
   * @return block Object
   */
  function dataToBlock(data) {
    var block = {
      hash: data.hash,
      id: data.block_index,
      //prevHash: data.prev_block,
      //size: data.size,
      bits: data.bits,
      //relayedBy: data.relayed_by,
      height: data.height,
      time: data.time,
      nTx: data.n_tx,
      lTx: {}
    };

    // Parsing transactions in this block
    data.tx.forEach(function(tx) {

      block.lTx[tx.tx_index] = {}

      // Parsing Inputs list.
      // Using try/catch to handle the case when inputs == [{}]
      /*try {
        var input_list = [];
        tx.inputs.forEach(function(input) {
          input_list.push({
            addr: input.prev_out.addr,
            n: input.prev_out.n,
            id: input.prev_out.tx_index,
            value: input.prev_out.value
          });
          block.lTx[tx.tx_index].in = input_list;
        });
      } catch (err) {
      }*/

      // Parsing Out list.
      /*tx.out.forEach(function(output) {
        block.lTx[tx.tx_index].out.push({
          addr: output.addr,
          n: output.n,
          value: output.value
        });
      });*/
    })
    return block;
  }

  return {
    getBlock: function(hash) {
      var deferred = $q.defer();
      $http.get(getHashURL(hash)).
        success(function(data) {
          deferred.resolve({block: dataToBlock(data), prevHash: data.prev_block});
          if (!$rootScope.$$phase)
            $rootScope.$apply();
        });
      return deferred.promise;
    },

    // Dirty method: nested http requests.
    /**
     * Fetch the latest hash in the blockchain. Then fetch 3 latest blocks in the blockchain.
     * @returns { blocks: array, latestHash: string, prevHash: string}
     */
    getLatestBlocks: function() {
      var result = { blocks: [], latestHash: null, prevHash: null},
        deferred = $q.defer();
      // Latest hash
      $http.get(LATEST_HASH_URL).
        success(function(data) {
          result.latestHash = data;
          // First block
          $http.get(getHashURL(data)).
            success(function(data) {
              result.blocks.push(dataToBlock(data));
              // Second block
              $http.get(getHashURL(data.prev_block)).
                success(function(data) {
                  result.blocks.push(dataToBlock(data));
                  // Third block
                  $http.get(getHashURL(data.prev_block)).
                    success(function(data) {
                      result.blocks.push(dataToBlock(data));
                      result.prevHash = data.prev_block;
                      //result.lowestHash = data.hash;
                      deferred.resolve(result);
                      if (!$rootScope.$$phase)
                        $rootScope.$apply();
                    })
                })
            })
        });

      return deferred.promise;
    }


  };
});

bcModule.factory('bcWebsocket', function() {
  var ws = new WebSocket('ws://ws.blockchain.info/inv'),
    observerCallbacks = [];

  ws.onopen = function() {
    console.log('Socket has been opened!');
    // Sending messages to subscribe to the channels
    // New blocks: {"op": "blocks_sub"}
    // Debugging purpose: {"op":"ping_block"}
    ws.send('{"op":"ping_block"}');
  };

  ws.onerror = function(err) {
    console.log('Websocket error: ', err);
  };

  ws.onmessage = function(message) {
    listener(JSON.parse(message.data));
  };

  /**
   * Message listener
   * Notifying all observers by calling their callbacks
   * @param data
   */
  function listener(data) {
    console.log('Received data from the websocket: ', data);
    if (data.op != 'block') {
      console.log('Received a wrong type of message: ', data.op);
    }
    else {
      angular.forEach(observerCallbacks, function(callback) {
        callback(dataToBlock(data));
      });
    }
  }

  function dataToBlock(data) {
    var block = {
      hash: data.x.hash,
      id: data.x.blockIndex,
      //prevHash: data.prev_block,
      bits: data.x.bits,
      //relayedBy: data.relayed_by,
      height: data.x.height,
      time: data.x.time,
      nTx: data.x.nTx,
      lTx: {}
    };

    // Parsing transactions in this block
    // No details of the transactions included in the message
    data.x.txIndexes.forEach(function(tx) {
      block.lTx[tx] = {}
    })

    return block;
  }

  return {
    /**
     * Storing observers' callbacks in observerCallbacks
     * @param callback
     */
    registerCallback: function(callback) {
      observerCallbacks.push(callback);
    }
  };
});