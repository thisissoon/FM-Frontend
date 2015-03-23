"use strict";

describe("sn.fm.player:SearchCtrl", function() {

    var $scope, $q, Spotify, PlayerQueueResource, spotifyCallback;

    beforeEach(function (){
        module("sn.fm.player");
    });

    beforeEach(inject(function ($httpBackend) {
        $httpBackend.whenGET(/.*/).respond(200, []);
    }));

    beforeEach(inject(function ( $rootScope, $injector, $controller ) {
        $scope = $rootScope.$new();
        $q = $injector.get("$q");

        spotifyCallback = function(){
            return {
                then: function(fn){
                    fn.apply(this,[{ tracks: { items: [] } }])
                }
            }
        }

        Spotify = {
            search: function(){}
        }
        spyOn(Spotify, "search").and.callFake(spotifyCallback);

        PlayerQueueResource = $injector.get("PlayerQueueResource");
        spyOn(PlayerQueueResource, "save");

        $controller("SearchCtrl", {
            $scope: $scope,
            $q: $q,
            Spotify: Spotify,
            PlayerQueueResource: PlayerQueueResource
        });
    }));

    it("should add selected song to playlist", function() {
        $scope.search("foo");
        expect(Spotify.search).toHaveBeenCalledWith("foo", "track", { limit: 20, market: "GB" });
    });

    it("should search for spotify track", function() {
        var track = { uri: "foo" };
        $scope.onTrackSelected(track);
        expect(PlayerQueueResource.save).toHaveBeenCalledWith(track);
    });

    it("should NOT search for spotify track", function() {
        var track = undefined;
        $scope.onTrackSelected(track);
        expect(PlayerQueueResource.save).not.toHaveBeenCalled();

        var track = {};
        $scope.onTrackSelected(track);
        expect(PlayerQueueResource.save).not.toHaveBeenCalled();
    });

});
