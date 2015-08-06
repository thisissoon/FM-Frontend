"use strict";

describe("FM.search.playlistDirective", function() {
    var element, $scope, $rootScope, isolatedScope, $templateCache;

    beforeEach(module("FM.search.playlistDirective"));

    beforeEach(inject(function (_$rootScope_, $compile, $injector) {
        $rootScope = _$rootScope_;
        $rootScope.playlist = { name: "foo" };

        $scope = $rootScope.$new();

        element = "<fm-playlist data-playlist=\"playlist\"></fm-playlist>";

        $templateCache = $injector.get("$templateCache");
        $templateCache.put("partials/search/playlist.html", "{{ playlist.name }}");

        element = $compile(element)($scope);
        $scope.$digest();

        isolatedScope = element.isolateScope();

    }));

    it("should render directive", function(){
        expect(element.html()).toContain("foo");
    });

});
