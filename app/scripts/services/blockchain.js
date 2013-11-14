/**
 * Created by will on 11/14/13.
 */
'use strict'

services.factory('blockchain', [function () {
  var LATEST_HASH_URL = 'http://blockchain.info/q/latesthash',
    BLOCK_COUNT_URL = 'http://blockchain.info/q/getblockcount',
    BLOCK_HASH_URL = 'http://blockchain.info/rawblock/';

  /**
   * Retrieving the latest hash in blockchain
   * URL: http://blockchain.info/q/latesthash
   * @return {string}
   * Throw 'Error retrieving the latest hash'
   */
  function getLatestHash() {
    return $http.get(LATEST_HASH_URL).
      success(function(data) {
        return data;
      }).
      error(function(data, status) {
        throw 'Error retrieving the latest hash';
        console.log(status);
      })
  }

  /**
   * Retrieving the latest height in blockchain
   * URL: http://blockchain.info/q/getblockcount
   * @returns {string}
   * Throw 'Error retrieving the latest height'
   */
  function getLatestHeight() {
    return $http.get(BLOCK_COUNT_URL).
      success(function(data) {
        return data;
      }).
      error(function(data, status) {
        throw 'Error retrieving the latest height';
        console.log(status);
      });
  }

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
        relayeBy: tx.relayed_by,
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

    return block;
    })
  }

  return {
    updateBlocks: function(currentHash, currentHeight) {
      try {
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
              rBlock = this.getBlock(rHash);
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
      }
      return [];
    },

    getBlock: function(hash) {
      $http.get(getHashURL(hash)).
        success(function(data) {
          return dataToBlock(data);
        }).
        error(function(data, status) {
          console.log(status);
        });
    }
  };
}]);