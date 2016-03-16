"use strict";

describe("FM.search.SearchCtrl", function() {

    var $scope, $rootScope, $location, $httpBackend, $q, FM_API_SERVER_ADDRESS, Spotify, PlayerQueueResource, searchResults;

    beforeEach(function (){
        module("FM.search.SearchCtrl");
    });

    beforeEach(inject(function (_$httpBackend_, $injector) {
        $httpBackend = _$httpBackend_;
        FM_API_SERVER_ADDRESS = $injector.get("env").FM_API_SERVER_ADDRESS;

        searchResults = {
            artists: { items: [{},{}] },
            albums: { items: [{uri: "spotify:album:foo"},{uri: "spotify:album:bar"}] },
            tracks: { items: [{},{}] }
        }

        $httpBackend.whenGET(/partials\/.*/).respond(200, "");
        $httpBackend.whenGET(/api.spotify.com\/v1\/search.*/).respond(200, searchResults);
        $httpBackend.whenGET(/api.spotify.com\/v1\/albums.*/).respond(200, searchResults.albums.items[0]);
        $httpBackend.whenPOST(FM_API_SERVER_ADDRESS + "player/queue").respond(200);
    }));

    beforeEach(inject(function ( _$rootScope_, $injector, $controller ) {
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();

        $rootScope.toogleSidebar = function(){}

        $q = $injector.get("$q");
        $location = $injector.get("$location");

        Spotify = $injector.get("Spotify");
        spyOn(Spotify, "search").and.callFake(function() {
            return {
                then: function(callback) { return callback(searchResults); }
            };
        });

        PlayerQueueResource = $injector.get("PlayerQueueResource");
        spyOn(PlayerQueueResource, "save").and.callThrough();

        $controller("SearchCtrl", {
            $scope: $scope,
            $rootScope: $rootScope,
            $q: $q,
            $location: $location,
            Spotify: Spotify,
            PlayerQueueResource: PlayerQueueResource
        });
    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it("should search for spotify track", function() {
        $scope.search("foo");
        $httpBackend.flush();
        $rootScope.$digest();
        expect(Spotify.search).toHaveBeenCalled();

        searchResults = {
            artists: undefined,
            albums: undefined,
            tracks: undefined
        }
        $scope.search("foo");
        $rootScope.$digest();
        expect(Spotify.search.calls.count()).toBe(2);
    });

    it("should add selected song to playlist", function() {
        var track = { uri: "spotify:track:foo" };
        $scope.onTrackSelected(track);
        $httpBackend.flush();
        $rootScope.$digest();
        expect(PlayerQueueResource.save).toHaveBeenCalledWith(track);
    });

    it("should NOT add selected item to playlist", function() {
        spyOn($location, "path");
        var track = { uri: "spotify:album:foo" };;
        $scope.onTrackSelected(track);
        expect(PlayerQueueResource.save).not.toHaveBeenCalled();
        expect($location.path).toHaveBeenCalledWith("/albums/spotify:album:foo");

        track = undefined;
        $scope.onTrackSelected(track);
        expect(PlayerQueueResource.save).not.toHaveBeenCalled();

        track = {};
        $scope.onTrackSelected(track);
        expect(PlayerQueueResource.save).not.toHaveBeenCalled();

        track = { uri: "spotify:artist:foo" };;
        $scope.onTrackSelected(track);
        expect(PlayerQueueResource.save).not.toHaveBeenCalled();
        expect($location.path.calls.argsFor(1)).toEqual(["/artists/spotify:artist:foo"]);

    });

});
