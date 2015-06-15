"use strict";

describe("FM.history.HistoryCtrl", function() {

    var $rootScope, $scope, $location, $route, $httpBackend,
        PlayerHistoryResource, historyData;

    beforeEach(function (){
        module("FM.history.HistoryCtrl");
    });

     beforeEach(inject(function (_$httpBackend_) {
        $httpBackend = _$httpBackend_

        $httpBackend.whenGET(/.*player\/history/).respond(200, [{ track: { uri: "foo" } },{ track: { uri: "bar" } }], { "Total-Pages": "10", "Total-Count": "10" });
        $httpBackend.whenGET(/partials\/.*/).respond(200);
    }));


    beforeEach(inject(function ( _$rootScope_, $injector, $controller ) {
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();

        $location = $injector.get("$location");
        $route = $injector.get("$route");

        PlayerHistoryResource = $injector.get("PlayerHistoryResource");
        spyOn(PlayerHistoryResource, "query").and.callThrough();

        historyData = { items: [{ track: { uri: "foo" } },{ track: { uri: "bar" } }] };
        historyData.meta = { totalPages: 10, totalCount: 10 }

        $controller("HistoryCtrl", {
            $scope: $scope,
            PlayerHistoryResource: PlayerHistoryResource,
            historyData: historyData
        });
    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it("should load views", function() {
        $location.path("/history");
        $rootScope.$digest();
        $httpBackend.flush();
        expect($route.current.controller).toBe("HistoryCtrl");
    });

    it("should attach data to $scope", function(){
        expect($scope.history).toEqual(historyData.items);
    });

    it("should query next page from PlayerHistoryResource and add data to scope", function(){
        $scope.loadMore();
        expect($scope.page.loading).toBe(true);
        expect($scope.page.pages).toEqual(2);
        $httpBackend.flush();
        expect($scope.page.loading).toBe(false);
        expect($scope.history.length).toEqual(4);
        expect($scope.page.total).toEqual(10);
    });

});
