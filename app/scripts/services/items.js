'use strict';

function Item(block) {
  this.selected = false;
  angular.extend(this, block);
}

services.factory('items', ['$http', 'bcQuery', 'bcWebsocket', '$q', function($http, bcQuery, bcWebsocket, $q) {
  var items = {
    all: [],
    //filtered: [],
    selected: null,
    selectedIdx: null,
    prevHash: null,
    latestHash: null,
    promise: null,

    refreshItems: function() {
      items.all = [];
      //items.filtered = [];
      items.selected = null;
      items.selectedIdx = null;
      items.initialFetch();
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
      return items.selectedIdx < items.all.length - 1;
      //return items.selectedIdx < items.filtered.length - 1;
    },

    // Select a block by its index
    selectItem: function(idx) {
      if (items.selected) {
        items.selected.selected = false;
      }

      //items.selected = items.filtered[idx];
      items.selected = items.all[idx];
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

    /* No filter has been implemented yet.
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

    /*reindexSelectedItem: function() {
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
    },*/

    getLatestBlocks: function() {
      var deferred = $q.defer();
      bcQuery.getLatestBlocks().then(function(result) {
        if (!items.latestHash == result.latestHash)
        items.latestHash = result.latestHash;
        items.prevHash = result.prevHash;
        angular.forEach(result.blocks, function(block) {
          var item = new Item(block);
          items.all.push(item);
        });
        //items.filtered = items.all;
        //items.reindexSelectedItem();
        items.all.sort(function(blockA, blockB) {
          return blockA.height < blockB.height;
        });
        deferred.resolve(true);
      });
      return deferred.promise;
    },

    openWsListener: function() {
      function handleResponse(block) {
        if (block.id > items.all[0].id) {
          items.latestHash = block.hash;
          items.all.unshift(new Item(block));
          console.log('This just got pushed in :', block);
        }
      }

      bcWebsocket.registerCallback(handleResponse);
      bcWebsocket.subscribeToBlock();
    },

    /*getMoreBlocks: function() {
      if (items.pendingRequest == false) {
        items.pendingRequest = true;
        bcQuery.get3Blocks(items.prevHash).then(function(result) {
          items.prevHash = result.prevHash;
          var newItems = [];
          angular.forEach(result.blocks, function(block) {
            var item = new Item(block);
            newItems.push(item);
          });
          newItems.sort(function(blockA, blockB) {
            return blockA.height < blockB.height;
          });
          items.all = items.all.concat(newItems);
          //items.filtered = items.all;
          //items.reindexSelectedItem();
        });
      }
      else {
        console.log('request pending');
      }
    },*/

    getMore: function() {
      function handleResponse(response) {
        items.prevHash = response.prevHash;
        items.all.push(new Item(response.block));
        //items.filtered = items.all;
        //items.reindexSelectedItem();
      };

      var deferred = $q.defer();
      if (items.promise) {
        var prevPromise = items.promise;
        prevPromise.then(function() {
          bcQuery.getBlock(items.prevHash).then(function(result) {
            handleResponse(result);
            deferred.resolve(true);
          });
        });
      }
      else {
        bcQuery.getBlock(items.prevHash).then(function(result) {
          handleResponse(result);
          deferred.resolve(true);
        });
      }
      items.promise = deferred.promise;
    },

    getTransaction: function(transId) {
      var deferred = $q.defer();
      bcQuery.getTrans(transId).then(function(trans) {
        if (items.selected.lTx.hasOwnProperty(transId)) {
          items.selected.lTx[transId] = trans;
        }
        else {
          console.log('The currently selected block does not contain this transaction ', items.selected, transId);
        }
        deferred.resolve(true);
      });
      return deferred.promise;
    },

    initialFetch: function() {
      items.getLatestBlocks().then(function() {
        console.log(items.all);
        items.openWsListener();
        items.getMore();
        items.getMore();
        items.getMore();
        items.getMore();
      });
    }
  };

  items.initialFetch();
  return items;
}]);