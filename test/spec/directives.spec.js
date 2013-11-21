/**
 * Created by will on 11/19/13.
 */
describe('BEApp directives', function() {
  var scope, element, $compile;

  beforeEach(module('BEApp.directives'));

  beforeEach(inject(function(_$rootScope_, _$compile_, _$httpBackend_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $httpBackend = _$httpBackend_;
    $httpBackend.when('GET', 'views/editable-text.html').respond('<div class="editable-text"><div ng-show="readOnly">{{value}}</div><div ng-hide="readOnly"><input ng-model="value"></div></div>');
  }));

  describe('editableText directive', function() {
    /**
     * <editable-text value="value"></editable-text>
     * template:
     *   <div class="editable-text">
     *     <div ng-show="readOnly">
     *       {{value}}
     *     </div>
     *     <div ng-hide="readOnly">
     *       <input ng-model="value">
     *     </div>
     *   </div>
     */
    it('adds a "editable-text" class to the div element', function() {

    });
  });

  describe('expandPin directive', function() {

  })
});