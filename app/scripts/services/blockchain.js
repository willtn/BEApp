/**
 * Created by will on 11/14/13.
 */
'use strict'
var bcModule = angular.module('BEApp.bc', []);

bcModule.config(['$httpProvider', function($httpProvider) {
  delete $httpProvider.defaults.headers.common["X-Requested-With"];
}]);

bcModule.factory('blockchain', function ($http, $q, $rootScope) {
  var LATEST_HASH_URL = 'http://blockchain.info/q/latesthash',
    BLOCK_COUNT_URL = 'http://blockchain.info/q/getblockcount',
    BLOCK_HASH_URL = 'http://blockchain.info/rawblock/';

  /**
   * Generate the URL for the given block hash
   * @param hash
   * @returns {string}
   */
  function getHashURL(hash) {
    return BLOCK_HASH_URL + hash + '?format=json&cors=true';
  }

  function getBlock(hash) {
    $http.get(getHashURL(hash)).
      success(function(data) {
        return dataToBlock(data);
      }).
      error(function(data, status) {
        console.log(status);
      });
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
      prevHash: data.prev_block,
      bits: data.bits,
      relayedBy: data.relayed_by,
      height: data.height,
      nTx: data.n_tx,
      lTx: {}
    };

    // Parsing transactions in this block
    data.tx.forEach(function(tx) {

      block.lTx[tx.tx_index] = {
        hash: tx.hash,
        id: tx.tx_index,
        relayedBy: tx.relayed_by,
        size: tx.size,
        in: [],
        out: []
      };

      // Parsing Inputs list.
      // Using try/catch to handle the case when inputs == [{}]
      try {
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
      }

      // Parsing Out list.
      tx.out.forEach(function(output) {
        block.lTx[tx.tx_index].out.push({
          addr: output.addr,
          n: output.n,
          value: output.value
        });
      });
    })
    return block;
  }

  return {

    /**
     * Get as many blocks as needed to keep up-to-date.
     * @param currentHash
     * @param currentHeight
     * @returns {Array}
     */
    // Need to figure out how to do dynamically chain asynchronous requests
    updateBlocks: function(currentHash, currentHeight) {
      var deferred = $q.defer();
      /*try {
        var latestHash = getLatestHash(),
          latestHeight = getLatestHeight(),
          blocks = [];
        if (latestHash !== currentHash && latestHeight !== currentHeight)  {
          var count = latestHeight - currentHeight,
            rHash = latestHash,
            rBlock = null;
          async.whilst(
            // Test
            function () { return (count > 0 && rHash != curentHash)},
            function() {
              rBlock = getBlock(rHash);
              blocks.push(rBlock);
              rHash = rBlock.prevhash;
            },
            function() { return blocks;}
          );
        } else {
          throw 'Hash and height are out of sync.';
        }
      }
      catch (e) {
        console.log(e);
      }*/
      return deferred.promise;
    },

    // Dirty method: nested http requests.
    /**
     * Fetch 3 blocks from the given hash
     * @param hash
     * @returns {blocks: Array, prevHash: string}
     */
    get3Blocks: function(hash) {
      var result = { blocks: [], prevHash: null},
        deferred = $q.defer();
      // First block
      $http.get(getHashURL(hash)).
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
                  deferred.resolve(result);
                  if (!$rootScope.$$phase)
                    $rootScope.$apply();
                })
            })
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