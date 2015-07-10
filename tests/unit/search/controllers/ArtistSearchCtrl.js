"use strict";

describe("FM.search.ArtistSearchCtrl", function() {

    var $scope, $route, $rootScope, $httpBackend, Spotify, $location, search;

    beforeEach(function (){
        module("FM.search.ArtistSearchCtrl");
    });

    beforeEach(inject(function (_$httpBackend_) {
        $httpBackend = _$httpBackend_;
        $httpBackend.whenGET(/partials\/.*/).respond(200, "");
        $httpBackend.whenGET(/api.spotify.com\/v1\/search.*/).respond(200, {  artists: { items: [{},{}] }});
    }));

    beforeEach(inject(function (  _$location_, _$route_, _$rootScope_, $injector, $controller ) {
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();

        $route = _$route_;

        $location = $injector.get("$location");

        Spotify = $injector.get("Spotify");

        search = {
            artists: {
                items: [{},{}]
            }
        };

        $controller("ArtistSearchCtrl", {
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

    it("should load artists search view", function() {
        $location.path("/artists");
        $rootScope.$digest();
        $httpBackend.flush();
        expect($route.current.controller).toBe("ArtistSearchCtrl");
    });

    it("should load more artists", function() {
        expect($scope.artists).toEqual(search.artists.items);
        expect($scope.artists.length).toBe(2);
        $scope.loadMore();
        $httpBackend.flush();

        expect($scope.artists.length).toBe(4);
    });

});
