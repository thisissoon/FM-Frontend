"use strict";

describe("FM.search.artistDirective", function() {
    var element, $scope, $rootScope, isolatedScope, $templateCache;

    beforeEach(module("FM.search.artistDirective"));

    beforeEach(inject(function (_$rootScope_, $compile, $injector) {
        $rootScope = _$rootScope_;
        $rootScope.artist = { name: "foo" };
                
        $scope = $rootScope.$new();

        element = "<fm-artist data-artist=\"artist\"></fm-artist>";

        $templateCache = $injector.get("$templateCache");
        $templateCache.put("partials/search/artist.html", "{{ artist.name }}");

        element = $compile(element)($scope);
        $scope.$digest();

        isolatedScope = element.isolateScope();

    }));

    it("should render directive", function(){
        expect(element.html()).toContain("foo");
    });

});
