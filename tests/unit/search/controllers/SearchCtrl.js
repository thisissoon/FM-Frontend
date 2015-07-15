"use strict";

describe("FM.search.SearchCtrl", function() {

    var $scope, $rootScope, $httpBackend, $q, FM_API_SERVER_ADDRESS, Spotify, PlayerQueueResource, searchResults;

    beforeEach(function (){
        module("FM.search.SearchCtrl");
    });

    beforeEach(inject(function (_$httpBackend_, $injector) {
        $httpBackend = _$httpBackend_;
        FM_API_SERVER_ADDRESS = $injector.get("FM_API_SERVER_ADDRESS");

        searchResults = {
            artists: { items: [{},{}] },
            albums: { items: [{},{}] },
            tracks: { items: [{},{}] }
        }

        $httpBackend.whenGET(/partials\/.*/).respond(200, "");
        $httpBackend.whenGET(/api.spotify.com\/v1\/search.*/).respond(200, searchResults);
        $httpBackend.whenPOST(FM_API_SERVER_ADDRESS + "player/queue").respond(200);
    }));

    beforeEach(inject(function ( $rootScope, $injector, $controller ) {
        $scope = $rootScope.$new();
        $rootScope = $rootScope;

        $rootScope.toogleSidebar = function(){}

        $q = $injector.get("$q");

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
            Spotify: Spotify,
            PlayerQueueResource: PlayerQueueResource
        });
    }));

    it("should search for spotify track", function() {
        $scope.search("foo");
        expect(Spotify.search).toHaveBeenCalled();

        searchResults = {
            artists: undefined,
            albums: undefined,
            tracks: undefined
        }
        $scope.search("foo");
        expect(Spotify.search.calls.count()).toBe(2);
    });

    it("should add selected song to playlist", function() {
        var track = { uri: "spotify:track:foo" };
        $scope.onTrackSelected(track);
        expect(PlayerQueueResource.save).toHaveBeenCalledWith(track);
    });

    it("should NOT add selected item to playlist", function() {
        var track = { uri: "spotify:album:foo" };;
        $scope.onTrackSelected(track);
        expect(PlayerQueueResource.save).not.toHaveBeenCalled();

        var track = undefined;
        $scope.onTrackSelected(track);
        expect(PlayerQueueResource.save).not.toHaveBeenCalled();

        var track = {};
        $scope.onTrackSelected(track);
        expect(PlayerQueueResource.save).not.toHaveBeenCalled();
    });

});
