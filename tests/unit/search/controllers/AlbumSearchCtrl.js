"use strict";

describe("FM.search.AlbumSearchCtrl", function() {

    var $scope, $route, $rootScope, $httpBackend, Spotify, $location, search;

    beforeEach(function (){
        module("FM.search.AlbumSearchCtrl");
    });

    beforeEach(inject(function (_$httpBackend_) {
        $httpBackend = _$httpBackend_;
        $httpBackend.whenGET(/partials\/.*/).respond(200, "");
        $httpBackend.whenGET(/api.spotify.com\/v1\/search.*/).respond(200, {  albums: { items: [{},{}] }});
    }));

    beforeEach(inject(function (  _$location_, _$route_, _$rootScope_, $injector, $controller ) {
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();

        $route = _$route_;

        $location = $injector.get("$location");

        Spotify = $injector.get("Spotify");

        search = {
            albums: {
                items: [{},{}]
            }
        };

        $controller("AlbumSearchCtrl", {
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

    it("should load albums search view", function() {
        $location.path("/albums");
        $rootScope.$digest();
        $httpBackend.flush();
        expect($route.current.controller).toBe("AlbumSearchCtrl");
    });

    it("should load more albums", function() {
        expect($scope.albums).toEqual(search.albums.items);
        expect($scope.albums.length).toBe(2);
        $scope.loadMore();
        $httpBackend.flush();

        expect($scope.albums.length).toBe(4);
    });

});
