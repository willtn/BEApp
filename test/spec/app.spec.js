/**
 * Created by will on 11/10/13.
 */
'use strict';

describe('BEApp', function() {
  var beapp = null;
  beforeEach(function() {
    beapp = angular.module('BEApp');
  });

  it('should be registered', function() {
    expect(beapp).not.toBe(null);
  });
});
