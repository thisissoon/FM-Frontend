"use strict";

describe("FM.player.trackDirective", function() {
    var element, $scope, $rootScope, $templateCache;

    beforeEach(module("FM.player.trackDirective"));

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
