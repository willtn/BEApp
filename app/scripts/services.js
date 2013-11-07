'use strict';

function Item(block) {
  this.selected = false;

  angular.extend(this, block);
}

var services = angular.module('BEApp.services', []);

services.factory('items', ['$http', function($http) {
  var BLOCK_COUNT_URL = 'http://blockchain.info/q/getblockcount',
    LATEST_HASH_URL = 'http://blockchain.info/q/latesthash';
  var items = {
    all: [],
    filtered: [],
    selected: null,
    selectedIdx: null,
    prevHash: null,


    /*
    Transform JSON response into Block then into Item
     */
    dataToItem: function(data) {
      var block = {
        hash: data.hash,
        index: data.index,
        prev_hash: data.prev_block,
        bits: data.bits,
        relayed_by: data.relayed_by,
        n_tx: data.n_tx,
        l_tx: {}
      };

      data.tx.forEach(function(tx) {
        block.l_tx[tx.hash] = {
          hash: tx.hash,
          index: tx.index,
          relayed_by: tx.relayed_by,
          size: tx.size
        };
      })
      return new Item(block);
    },

    getLocalUrl: function(hash) {
      return '/json/blocks/' + hash + '.json';
    },

    getItemFromLocalStore: function() {
      if (!items.prevHash) {
        items.prevHash = '0000000000000003c718e7ef998706e893b1e0e531784ee4ba66b677bbd278b7';
      }

      for (var i = 0; i < 10; ++i){
        $http.get(items.getLocalUrl(items.prevHash)).then(
          function(data) {
            items.all.push(items.dataToItem(data));
            console.log(data.hash);
           items.prevHash = data.prev_block;
          },
          function(data, status) {
            console.log(data, status);
            break;
          }
        );
      }
    },

    /*
    Get the URL to Block Request API
     'http://blockchain.info/rawblock/$block_hash?format=json&cors=true'
     */
    getRemoteUrl: function(hash) {
      return 'http://blockchain.info/rawblock/' + hash + '?format=json&cors=true';
    },

    get5ItemsfromRemoteStore: function() {

    },

    /*
     Get the latest block from Blockchain
     Assign the hash to prevHash
     Flush Items
     API Url: http://blockchain.info/latestblock?cors=true
     */
    refreshItems: function() {
      $http.get(LATEST_HASH_URL).then(
      );
    },

    prev: function() {
      if (items.hasPrev()) {
        items.selectItem(items.selected ? items.selectedIdx - 1 : 0);
      }
    },

    next: function() {
      if (items.hasNext()) {
        items.selectItem(items.selected ? items.selectedIdx + 1: 0);
      }
    },

    hasPrev: function() {
      if (!items.selected) {
        return true;
      }
      return items.selectedIdx > 0;
    },

    hasNext: function() {
      if (!items.selected) {
        return true;
      }
      return items.selectedIdx > 0;
    },

    selectItem: function(idx) {
      if (items.selected) {
        items.selected.selected = false;
      }

      items.selected = items.filtered[idx];
      items.selectedIdx = idx;
      items.selected.selected = true;
    },

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

  //
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
      var itemHeight = $('.entry.active').height() + 60;
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
        var curScrollPos = $('.summaries').scrollTop();
        var itemTop = $('.summary.active').offset().top - 60;
        $('.summaries').animate({'scrollTop': curScrollPos + itemTop}, 200);
        $('.entries article.active')[0].scrollIntoView();
      }, 0, false);
    }
  };
});
