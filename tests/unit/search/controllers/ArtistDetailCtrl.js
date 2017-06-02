"use strict";

describe("FM.search.ArtistDetailCtrl", function() {

    var $scope, $route, $rootScope, $httpBackend, PlayerSpotifyArtistResource, $location,
        artist, artists, albums, singles, topTracks;

    beforeEach(function (){
        module("FM.search.ArtistDetailCtrl");
    });

    beforeEach(inject(function (_$httpBackend_) {
        $httpBackend = _$httpBackend_;

        topTracks = { tracks: [{},{}] };
        albums = { items: [{},{}] };
        artist = { id: "123" };
        artists = { artists: [{ id: "123" },{ id: "123" }] };

        $httpBackend.whenGET(/partials\/.*/).respond(200, "");
        $httpBackend.whenGET(/.*\/artists\/.*\/top-tracks/).respond(200, topTracks);
        $httpBackend.whenGET(/.*\/artists\/.*\/related-artists/).respond(200, artists);
        $httpBackend.whenGET(/.*\/artists\/.*\/albums/).respond(200, albums);
        $httpBackend.whenGET(/.*\/artists\/.*/).respond(200, artist);
    }));

    beforeEach(inject(function (  _$location_, _$route_, _$rootScope_, $injector, $controller ) {
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();

        $route = _$route_;

        $location = $injector.get("$location");

        PlayerSpotifyArtistResource = $injector.get("PlayerSpotifyArtistResource");

        $controller("ArtistDetailCtrl", {
            $scope: $scope,
            $location: $location,
            PlayerSpotifyArtistResource: PlayerSpotifyArtistResource,
            artist: artist,
            albums: albums,
            singles: albums,
            relatedArtists: artists,
            topTracks: topTracks
        });
    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it("should load track search view", function() {
        $location.path("/artists/123");
        $rootScope.$digest();
        $httpBackend.flush();
        expect($route.current.controller).toBe("ArtistDetailCtrl");
    });

    it("should load more albums", function() {
        expect($scope.albums).toEqual(albums.items);
        expect($scope.albums.length).toBe(2);
        $scope.loadMoreAlbums();
        $httpBackend.flush();

        expect($scope.albums.length).toBe(4);
    });

    it("should load more singles", function() {
        expect($scope.singles).toEqual(albums.items);
        expect($scope.singles.length).toBe(2);
        $scope.loadMoreSingles();
        $httpBackend.flush();

        expect($scope.singles.length).toBe(4);
    });

});
