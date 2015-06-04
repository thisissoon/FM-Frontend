"use strict";

describe("FM.player.sliderDirective", function() {
    var element, $scope, $rootScope, $templateCache, isolateScope;

    beforeEach(module("FM.player.sliderDirective"));

    beforeEach(inject(function (_$rootScope_, $compile, $injector) {
        $rootScope = _$rootScope_;

        $scope = $rootScope.$new();
        $scope.model = 1;

        element = "<fm-slider ng-model=\"model\" data-min=\"0\" data-max=\"100\"></fm-slider>";

        $templateCache = $injector.get("$templateCache");
        $templateCache.put("partials/slider.html", "foo");

        element = $compile(element)($scope);
        $scope.$digest();

        isolateScope = element.isolateScope();

    }));

    it("should render directive", function(){
        expect(element.html()).toContain("foo");
    });

    it("should set sliderValue to ngModel", function(){
        expect(isolateScope.sliderValue).toEqual(1);
    });

    it("should set ngModel onChange", function(){
        isolateScope.sliderValue = 5;
        isolateScope.onChange();
        expect($scope.model).toEqual(5);
    });

});
