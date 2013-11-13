'use strict';

function Item(block) {
  this.selected = false;

  angular.extend(this, block);
}

var services = angular.module('BEApp.services', []);

services.factory('items', ['$http', '$state', function($http, $state) {
  /*var BLOCK_COUNT_URL = 'http://blockchain.info/q/getblockcount',
    LATEST_HASH_URL = 'http://blockchain.info/q/latesthash';*/
  //var state = $state;
  var items = {
    all: [],
    filtered: [],
    selected: null,
    selectedIdx: null,
    //prevHash: null,

    /*
    Transform JSON response into Block then into Item
     */
    dataToItem: function(data) {
      var block = {
        hash: data.hash,
        id: data.block_index,
        prev_hash: data.prev_block,
        bits: data.bits,
        relayed_by: data.relayed_by,
        height: data.height,
        n_tx: data.n_tx,
        l_tx: {}
      };

      data.tx.forEach(function(tx) {

        block.l_tx[tx.tx_index] = {
          hash: tx.hash,
          id: tx.tx_index,
          relayed_by: tx.relayed_by,
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
            console.log(input.prev_out.value);
            block.l_tx[tx.tx_index].in = input_list;
          });
        } catch (err) {
          console.log(err);
        }

        // Parsing Out list.
        tx.out.forEach(function(output) {
          block.l_tx[tx.tx_index].out.push({
            addr: output.addr,
            n: output.n,
            value: output.value
          });
        });


      })
      return new Item(block);
    },

    // Generate the link to a local json file
    getLocalUrl: function(hash) {
      return '/json/blocks/' + hash + '.json';
    },

    // Fetch all local json files
    getItemFromLocalStore: function() {
      for (var i = 0; i < 1; ++i){
        // Having issue with asynchronous requests
        // Looking for a solution for chain requests

        /*$http.get(items.getLocalUrl(items.prevHash)).then(
          function(response) {
            items.all.push(items.dataToItem(response.data));
            console.log(response.data.hash);
            items.prevHash = response.data.prev_block;
            console.log(items.prevHash);
          },
          function(data, status) {
            console.log(data, status);

          }*/
        $http.get(items.getLocalUrl('0000000000000002e4607cdf63b538c9dfe92d5fb9b61ced4efed621e8b5e651')).then(
          function(response) {
            items.all.push(items.dataToItem(response.data));
            console.log(response.data.hash);
          });
        $http.get(items.getLocalUrl('000000000000000380df4545064963c898a30d8c743b15c563d03c1b5d4670b3')).then(
          function(response) {
            items.all.push(items.dataToItem(response.data));
            console.log(response.data.hash);
          });
        $http.get(items.getLocalUrl('0000000000000005f478a81a12a25b7a562f2f75d1088727aebb1170d4da3cc9')).then(
          function(response) {
            items.all.push(items.dataToItem(response.data));
            console.log(response.data.hash);
          }
        );
        $http.get(items.getLocalUrl('0000000000000005f7726612dad89f62c60a24ac5b951db84dce1396d9221d93')).then(
          function(response) {
            items.all.push(items.dataToItem(response.data));
            console.log(response.data.hash);
          }
        );
        $http.get(items.getLocalUrl('00000000000000057cbbe2e6e8c7a170875836cecc7a1ce1e5982a707f68065e')).then(
          function(response) {
            items.all.push(items.dataToItem(response.data));
            console.log(response.data.hash);
          }
        );
        $http.get(items.getLocalUrl('00000000000000070cefc4b3cea73dd2c9fa19e6572fa533992dcf9f16d5d202')).then(
          function(response) {
            items.all.push(items.dataToItem(response.data));
            console.log(response.data.hash);
          }
        );
        $http.get(items.getLocalUrl('0000000000000000076f8a07f1ca5affc32fa644fa05c17c06bc68bab705fc90')).then(
          function(response) {
            items.all.push(items.dataToItem(response.data));
            console.log(response.data.hash);
          }
        );
        $http.get(items.getLocalUrl('00000000000000081a028b7c2c3f468ccd468bc4dbe9a5d62534330700ecdfa4')).then(
          function(response) {
            items.all.push(items.dataToItem(response.data));
            console.log(response.data.hash);
          }
        );
        $http.get(items.getLocalUrl('00000000000000085a35ba8285555768e488ade52121fbe896f35a06e298f2b3')).then(
          function(response) {
            items.all.push(items.dataToItem(response.data));
            console.log(response.data.hash);
          }
        );
        $http.get(items.getLocalUrl('0000000000000003c718e7ef998706e893b1e0e531784ee4ba66b677bbd278b7')).then(
          function(response) {
            items.all.push(items.dataToItem(response.data));
            console.log(response.data.hash);
          }
        );
        $http.get(items.getLocalUrl('000000000000000549a71e9ccc7ef1c47796bccad3113eee91475569369b0223')).then(
          function(response) {
            items.all.push(items.dataToItem(response.data));
            console.log(response.data.hash);
          }
        );
        $http.get(items.getLocalUrl('000000000000000716cbbdeca6033cbaedeec9776385002d78f07c5f16ce4d55')).then(
          function(response) {
            items.all.push(items.dataToItem(response.data));
            console.log(response.data.hash);
          }
        );
        $http.get(items.getLocalUrl('00000000000000004601a9a6a517f3bfb0372e9fb1a112fd98207ad2fdbe37eb')).then(
          function(response) {
            items.all.push(items.dataToItem(response.data));
            console.log(response.data.hash);
          }
        );
        $http.get(items.getLocalUrl('00000000000000067603a70aa2069fe614639d0645a4523c42afab250ce9e942')).then(
          function(response) {
            items.all.push(items.dataToItem(response.data));
            console.log(response.data.hash);
          }
        );
        $http.get(items.getLocalUrl('00000000000000078287b47235ad1cde6ca6dd5a971c3184e466fc9dfdba2c49')).then(
          function(response) {
            items.all.push(items.dataToItem(response.data));
            console.log(response.data.hash);
          }
        );
        $http.get(items.getLocalUrl('0000000000000008356228e6f0d6194d97cb263707467432e22f58a5d792422b')).then(
          function(response) {
            items.all.push(items.dataToItem(response.data));
            console.log(response.data.hash);
          }
        );
        $http.get(items.getLocalUrl('00000000000000053964992c212e5470879e4ea09b2de4f4368202aacface391')).then(
          function(response) {
            items.all.push(items.dataToItem(response.data));
            console.log(response.data.hash);
          }
        );
      };
      items.filtered = items.all;
    },

    /*
    Get the URL to Block Request API
     'http://blockchain.info/rawblock/$block_hash?format=json&cors=true'
     */
    /*getRemoteUrl: function(hash) {
      return 'http://blockchain.info/rawblock/' + hash + '?format=json&cors=true';
    },*/

    /*
     Get the latest block from Blockchain
     Assign the hash to prevHash
     Flush Items
     API Url: http://blockchain.info/latestblock?cors=true
     */
    refreshItems: function() {
      items.all = [];
      items.selected = null;
      items.selectedIdx = null;
      items.getItemFromLocalStore();
    },

    // Select the first block
    top: function() {
      items.selectItem(0);
    },

    // Select the previous block
    prev: function() {
      if (items.hasPrev()) {
        items.selectItem(items.selected ? items.selectedIdx - 1 : 0);
      }
    },

    // Select the next block
    next: function() {
      if (items.hasNext()) {
        items.selectItem(items.selected ? items.selectedIdx + 1: 0);
      }
    },

    // Whether the selected block
    hasPrev: function() {
      if (!items.selected) {
        return true;
      }
      return items.selectedIdx > 0;
    },

    // Whether the selected block
    hasNext: function() {
      if (!items.selected) {
        return true;
      }
      return items.selectedIdx < items.filtered.length - 1;
    },

    // Select a block by its index
    selectItem: function(idx) {
      if (items.selected) {
        items.selected.selected = false;
      }

      items.selected = items.filtered[idx];
      items.selectedIdx = idx;
      items.selected.selected = true;
    },

    deselectItem: function() {
      if (items.selected) {
        items.selected.selected = false;
        items.selected = null;
        items.selectedIdx = null;
      }
    },

    /*
    filterBy: function(key, value){
      items.filtered = items.all.filtered(function(item) {
        return item[key] === value;
      });
      items.reindexSelectedItem();
    },

    clearFilter: function(){
      items.filtered = items.all;
      items.reindexSelectedItem();
    },
    */

    reindexSelectedItem: function() {
      if (items.selected) {
        var idx = items.filtered.indexOf(items.selected);

        if (idx === -1) {
          if (items.selected)
            items.selected.selected = false;
          items.selected = null;
          items.selectedIdx = null;
        } else {
          items.selectedIdx = idx;
          items.selected.selected = true;
        }
      }
    }
  };

  /*
  if (!items.prevHash) {
    items.prevHash = '0000000000000002e4607cdf63b538c9dfe92d5fb9b61ced4efed621e8b5e651';
  }*/

  items.getItemFromLocalStore();
  return items;
}]);

/**
 * Service that is in charge of scrolling in the app.
 */
//TODO: still need to rename the DOM objects
services.factory('scroll', function($timeout) {
  return {
    pageDown: function() {
      var itemHeight = $('.wrapper.active').height() + 60;
      var winHeight = $(window).height();
      var curScroll = $('.entries').scrollTop();
      var scroll = curScroll + winHeight;

      if (scroll < itemHeight) {
        $('.entries').scrollTop(scroll);
        return true;
      }

      // already at the bottom
      return false;
    },

    toCurrent: function() {
      // Need the setTimeout to prevent race condition with item being selected.
      $timeout(function() {
        var curScrollPos = $('.blocks').scrollTop();
        var itemTop = $('.block.active').offset().top - 60;
        $('.blocks').animate({'scrollTop': curScrollPos + itemTop}, 200);
      }, 0, false);
    }
  };
});
