'use strict';

describe('BEApp.services', function() {
  var $http, $httpBackend, items;
  beforeEach(module('BEApp.services'));
  beforeEach(inject(function(_$http_, _$httpBackend_){
    $http = _$http_;
    $httpBackend = _$httpBackend_;
  }));
  beforeEach(inject(function (_items_) {
    items = _items_;
  }));

  it('should give the url to the block at height 20000', function() {
    expect(items.getLocalUrl(20000)).toEqual('/json/blocks/20000.json');
  });

  it('should pass 10 blocks to items')
});