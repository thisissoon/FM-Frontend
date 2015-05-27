"use strict";

describe("FM.loadingScreen", function() {
    var element, $scope, $rootScope, $templateCache;

    beforeEach(module("FM.loadingScreen"));

    beforeEach(inject(function (_$rootScope_, $compile, $injector) {
        $rootScope = _$rootScope_;

        $scope = $rootScope.$new();

        element = "<fm-loading-screen></fm-loading-screen>";

        $templateCache = $injector.get("$templateCache");
        $templateCache.put("partials/loading.html", "");

        element = $compile(element)($scope);
        $scope.$digest();

    }));

    it("should hide the loading screen on $routeChangeSuccess event", function(){
        expect(element.hasClass("hidden")).toBe(false);

        $rootScope.$broadcast("$routeChangeSuccess");
        expect(element.hasClass("hidden")).toBe(true);
    });

    it("should hide the loading screen on $routeChangeError event", function(){
        expect(element.hasClass("hidden")).toBe(false);

        $rootScope.$broadcast("$routeChangeError");
        expect(element.hasClass("hidden")).toBe(true);
    });

    it("should show the loading screen on $routeChangeStart event", function(){
        $rootScope.$broadcast("$routeChangeError");
        expect(element.hasClass("hidden")).toBe(true);

        $rootScope.$broadcast("$routeChangeStart");
        expect(element.hasClass("hidden")).toBe(false);
    });

});
