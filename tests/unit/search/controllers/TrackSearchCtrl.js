"use strict";

describe("FM.search.TrackSearchCtrl", function() {

    var $scope, $route, $rootScope, $httpBackend, Spotify, $location, search;

    beforeEach(function (){
        module("FM.search.TrackSearchCtrl");
    });

    beforeEach(inject(function (_$httpBackend_) {
        $httpBackend = _$httpBackend_;
        $httpBackend.whenGET(/partials\/.*/).respond(200, "");
        $httpBackend.whenGET(/api.spotify.com\/v1\/search.*/).respond(200, {  tracks: { items: [{},{}] }});
    }));

    beforeEach(inject(function (  _$location_, _$route_, _$rootScope_, $injector, $controller ) {
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();

        $route = _$route_;

        $location = $injector.get("$location");

        Spotify = $injector.get("Spotify");

        search = {
            tracks: {
                items: [{},{}]
            }
        };

        $controller("TrackSearchCtrl", {
            $scope: $scope,
            $location: $location,
            Spotify: Spotify,
            search: search
        });
    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it("should load track search view", function() {
        $location.path("/tracks");
        $rootScope.$digest();
        $httpBackend.flush();
        expect($route.current.controller).toBe("TrackSearchCtrl");
    });

    it("should load more tracks", function() {
        expect($scope.tracks).toEqual(search.tracks.items);
        expect($scope.tracks.length).toBe(2);
        $scope.loadMore();
        $httpBackend.flush();

        expect($scope.tracks.length).toBe(4);
    });

});
