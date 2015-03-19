"use strict";

describe("fm.player:track directive", function() {
    var element, $scope, $rootScope, $templateCache;

    beforeEach(module("sn.fm.player"));

    beforeEach(inject(function (_$rootScope_, $compile, $injector) {
        $rootScope = _$rootScope_;

        $scope = $rootScope.$new();

        element = "<fm-track></fm-track>";

        $templateCache = $injector.get("$templateCache");
        $templateCache.put("partials/track.html", "foo");

        element = $compile(element)($scope);
        $scope.$digest();

    }));

    it("should render directive", function(){
        expect(element.html()).toContain("foo");
    });

});
