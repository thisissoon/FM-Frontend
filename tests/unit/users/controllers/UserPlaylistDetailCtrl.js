"use strict";

describe("FM.users.UserPlaylistDetailCtrl", function() {

    var $scope, $route, $rootScope, $httpBackend, Spotify, $location,
        tracksResponse, playlistResponse;

    beforeEach(function (){
        module("FM.users.UserPlaylistDetailCtrl");
    });

    beforeEach(inject(function (_$httpBackend_) {
        $httpBackend = _$httpBackend_;

        tracksResponse = { items: [{ id: "foo" },{ id: "foo" }] };
        playlistResponse = { id: "bar", owner: { id: "foo" } };

        $httpBackend.whenGET(/partials\/.*/).respond(200, "");
        $httpBackend.whenGET(/api.spotify.com\/v1\/users\/.*\/playlists\/.*\/tracks/).respond(200, tracksResponse);
        $httpBackend.whenGET(/api.spotify.com\/v1\/users\/.*\/playlists\/.*/).respond(200, playlistResponse);
    }));

    beforeEach(inject(function (  _$location_, _$route_, _$rootScope_, $injector, $controller ) {
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();

        $route = _$route_;

        $location = $injector.get("$location");

        Spotify = $injector.get("Spotify");

        $controller("UserPlaylistDetailCtrl", {
            $scope: $scope,
            Spotify: Spotify,
            playlist: playlistResponse,
            playlistTracks: tracksResponse,
            env: $injector.get("env")
        });
    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it("should load track search view", function() {
        $location.path("/users/foo/playlists/bar");
        $rootScope.$digest();
        $httpBackend.flush();
        expect($route.current.controller).toBe("UserPlaylistDetailCtrl");
    });

    it("should load more tracks", function() {
        expect($scope.playlistTracks).toEqual(tracksResponse.items);
        expect($scope.playlistTracks.length).toBe(2);
        $scope.loadMore();
        $httpBackend.flush();

        expect($scope.playlistTracks.length).toBe(4);
    });

});
