"use strict";

describe("FM.search.AlbumDetailCtrl", function() {

    var $scope, $route, $rootScope, $httpBackend, PlayerSpotifyAlbumResource, $location, album, tracks;

    beforeEach(function (){
        module("FM.search.AlbumDetailCtrl");
    });

    beforeEach(inject(function (_$httpBackend_) {
        $httpBackend = _$httpBackend_;
        $httpBackend.whenGET(/partials\/.*/).respond(200, "");
        $httpBackend.whenGET(/.*\/albums\/.*\/tracks/).respond(200, { items: [{},{}] });
        $httpBackend.whenGET(/.*\/albums\/.*/).respond(200, { id: "123" });
    }));

    beforeEach(inject(function (  _$location_, _$route_, _$rootScope_, $injector, $controller ) {
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();

        $route = _$route_;

        $location = $injector.get("$location");

        PlayerSpotifyAlbumResource = $injector.get("PlayerSpotifyAlbumResource");

        tracks = {
            items: [{},{}]
        };

        album = {
            id: "123"
        };

        $controller("AlbumDetailCtrl", {
            $scope: $scope,
            $location: $location,
            PlayerSpotifyAlbumResource: PlayerSpotifyAlbumResource,
            album: album,
            albumTracks: tracks
        });
    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it("should load track search view", function() {
        $location.path("/albums/123");
        $rootScope.$digest();
        $httpBackend.flush();
        expect($route.current.controller).toBe("AlbumDetailCtrl");
    });

    it("should load more tracks", function() {
        expect($scope.albumTracks).toEqual(tracks.items);
        expect($scope.albumTracks.length).toBe(2);
        $scope.loadMore();
        $httpBackend.flush();

        expect($scope.albumTracks.length).toBe(4);
    });

});
