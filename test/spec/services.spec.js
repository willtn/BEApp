'use strict';

describe('items', function() {
  var $http, $httpBackend, items;
  beforeEach(module('BEApp.services'));
  beforeEach(inject(function(_$http_, _$httpBackend_) {
    $http = _$http_;
    $httpBackend = _$httpBackend_;
    jasmine.getJSONFixtures().fixturesPath = 'base/test/mock/blocks';
    $httpBackend.whenGET('/json/blocks/0000000000000002e4607cdf63b538c9dfe92d5fb9b61ced4efed621e8b5e651.json').respond(
      getJSONFixture('0000000000000002e4607cdf63b538c9dfe92d5fb9b61ced4efed621e8b5e651.json')
    );
    $httpBackend.whenGET('/json/blocks/000000000000000380df4545064963c898a30d8c743b15c563d03c1b5d4670b3.json').respond(
      getJSONFixture('000000000000000380df4545064963c898a30d8c743b15c563d03c1b5d4670b3.json')
    );
    $httpBackend.whenGET('/json/blocks/0000000000000005f478a81a12a25b7a562f2f75d1088727aebb1170d4da3cc9.json').respond(
      getJSONFixture('0000000000000005f478a81a12a25b7a562f2f75d1088727aebb1170d4da3cc9.json')
    );
  }));
  beforeEach(inject(function(_items_) {
    items = _items_;
  }));

  it('should give the url to the block at height 20000', function() {
    expect(items.getLocalUrl(20000)).toEqual('/json/blocks/20000.json');
  });

  it('should fetch 3 items', function() {
    expect(items.all).toEqual([]);
    expect(items.filtered).toEqual([]);
    expect(items.selected).toEqual(null);
    expect(items.selectedIdx).toEqual(null);
    expect(items.prevHash).toEqual('0000000000000002e4607cdf63b538c9dfe92d5fb9b61ced4efed621e8b5e651');
    expect(items.all.length).toEqual(0);

    $httpBackend.flush();

    expect(items.all.length).toEqual(3);
    expect(items.prevHash).toEqual('00000000000000085a35ba8285555768e488ade52121fbe896f35a06e298f2b3');
    expect(items.filtered.length).toEqual(3);
  });
});