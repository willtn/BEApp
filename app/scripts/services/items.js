'use strict';

function Item(block) {
  this.selected = false;

  angular.extend(this, block);
}

services.factory('items', ['$http', 'blockchain', '$q', function($http, blockchain, $q) {
  var items = {
    all: [],
    filtered: [],
    selected: null,
    selectedIdx: null,
    prevHash: null,
    latestHash: null,
    promise: null,
    pendingRequest: false,
    count: 0,

    refreshItems: function() {
      items.all = [];
      items.filter = [];
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
    },*/

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
    },

    initialFetch: function() {
      items.getLatestBlocks().then(function() {
          items.getMore();
          items.getMore();
          items.getMore();
          items.getMore();
      });
    },

    /*queueRequests: function(func) {
      if items.promise == null {
        var deferred = $q.defer();

      }
      else {

      }
    },*/

    getLatestBlocks: function() {
      var deferred = $q.defer();
      blockchain.getLatestBlocks().then(function(result) {
        items.latestHash = result.latestHash;
        items.prevHash = result.prevHash;
        //items.lowestHash = result.lowestHash;
        angular.forEach(result.blocks, function(block) {
          var item = new Item(block);
          //items.all[block.hash] = item;
          items.all.push(item);
          items.all.sort(function(blockA, blockB) {
            return blockA.height < blockB.height;
          });
        });
        items.filtered = items.all;
        //console.log(items.all);
        items.reindexSelectedItem();
        deferred.resolve(true);
      });
      return deferred.promise;
    },

    getMoreBlocks: function() {
      if (items.pendingRequest == false) {
        items.pendingRequest = true;
        blockchain.get3Blocks(items.prevHash).then(function(result) {
          items.prevHash = result.prevHash;
          //items.lowestHash = result.lowestHash;
          var newItems = [];
          angular.forEach(result.blocks, function(block) {
            var item = new Item(block);
            //items.all[block.hash] = block;
            newItems.push(item);
            newItems.sort(function(blockA, blockB) {
              return blockA.height < blockB.height;
            });
          });
          items.all = items.all.concat(newItems);
          items.pendingRequest = false;
          items.filtered = items.all;
          items.reindexSelectedItem();
        });
      }
      else {
        console.log('request pending');
      }
    },

    getMore: function() {

      if (items.promise) {
        var prevPromise = items.promise, deferred = $q.defer();
        prevPromise.then(function() {
          //var deferred = $q.defer();

          blockchain.getBlock(items.prevHash).then(function(result) {
            //var newItems = [];
            items.prevHash = result.prevHash;
            /*angular.forEach(result.blocks, function(block) {
              var item = new Item(block);
              //items.all[block.hash] = block;
              newItems.push(item);
              newItems.sort(function(blockA, blockB) {
                return blockA.height < blockB.height;
              });
            });
            items.all = items.all.concat(newItems);
            items.pendingRequest = false;*/
            items.all.push(new Item(result.block));
            items.filtered = items.all;
            items.reindexSelectedItem();
            deferred.resolve(true);
          });

        });
        items.promise = deferred.promise;
      }
      else {
        var deferred = $q.defer();
          items.count++;
          console.log(items.count);
        blockchain.getBlock(items.prevHash).then(function(result) {
          //var newItems = [];
          items.prevHash = result.prevHash;
          /*angular.forEach(result.blocks, function(block) {
            var item = new Item(block);
            newItems.push(item);
            newItems.sort(function(blockA, blockB) {
              return blockA.height < blockB.height;
            });
          });
          items.all = items.all.concat(newItems);
          items.pendingRequest = false;*/
          items.all.push(new Item(result.block));
          items.filtered = items.all;
          items.reindexSelectedItem();
          deferred.resolve(true);
        });
        items.promise = deferred.promise;
      }
    }

  };
  items.initialFetch();
  return items;
}]);