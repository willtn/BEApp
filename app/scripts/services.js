'use strict';

function Item(block) {
  this.selected = false;

  angular.extend(this, entry);
}

var CURRENT_HEIGHT_URL = 'http://blockchain.info/q/getblockcount',
    services = angular.module('BEApp.services', []);

services.factory('items', ['$http', function($http) {
  var items = {
    all: [],
    filtered: [],
    selected: null,
    selectedIdx: null,
    currentHeight: null,

    getCurentBlockCount: function($http) {
      return $http.get(CURRENT_HEIGHT_URL).
        success(function(data, status) {
          console.log(data, status);
          return data;
        }).
        error(function(data, status) {
          console.log(data, status);
          return -1;
        })
    },

    getLocalUrl: function(height) {
      return '/json/blocks/' + height;
    },

    getItemFromLocalStore: function() {
      if (!currentHeight) {
        currentHeight = 200000;
      }

      for (var i = 0; i < 10; ++i){
        ($http.get(items.getLocalUrl(height - i)).then(function(response) {
          var block = {
            hash: response.hash,
            index: response.block_index,
            bits: response.bits,
            height: response.height,
            relayed_by: response.relayed_by,
            n_tx: response.n_tx,
            l_tx: {}
          };

          response.data.tx.forEach(function(tx){
            block.l_tx[tx.hash] = {
              hash: tx.hash,
              index: tx.tx_index,
              relayed_by: tx.relayed_by,
              size: tx.size
            };
          });

          items.all.push(block);
        }));
      }
      return
    },

    getItemfromRemoteStore: function() {

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
