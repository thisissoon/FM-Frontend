"use strict";

describe("FM.search.albumDirective", function() {
    var element, $scope, $rootScope, isolatedScope, $templateCache;

    beforeEach(module("FM.search.albumDirective"));

    beforeEach(inject(function (_$rootScope_, $compile, $injector) {
        $rootScope = _$rootScope_;
        $rootScope.album = { name: "foo" };

        $scope = $rootScope.$new();

        element = "<fm-album data-album=\"album\"></fm-album>";

        $templateCache = $injector.get("$templateCache");
        $templateCache.put("partials/search/album.html", "{{ album.name }}");

        element = $compile(element)($scope);
        $scope.$digest();

        isolatedScope = element.isolateScope();

    }));

    it("should render directive", function(){
        expect(element.html()).toContain("foo");
    });

});
