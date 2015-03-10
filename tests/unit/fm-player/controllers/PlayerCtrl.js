"use strict";

describe("sn.fm.player:PlayerCtrl", function() {

    var $scope, $q, Spotify, PlayerQueueResource, callback;

    beforeEach(function (){
        module("sn.fm.player");
    });

    beforeEach(inject(function ($httpBackend) {
        $httpBackend.whenGET(/.*/).respond(200, []);
    }));

    beforeEach(inject(function ( $rootScope, $injector, $controller ) {
        $scope = $rootScope.$new();
        $q = $injector.get("$q");

        callback = function(){
            return {
                then: function(fn){
                    fn.apply(this,[{ tracks: { items: [] } }])
                }
            }
        }

        Spotify = {
            search: function(){}
        }
        spyOn(Spotify, "search").and.callFake(callback);

        PlayerQueueResource = $injector.get("PlayerQueueResource");
        spyOn(PlayerQueueResource, "save");

        $controller("PlayerCtrl", {
            $scope: $scope,
            $q: $q,
            Spotify: Spotify,
            PlayerQueueResource: PlayerQueueResource
        });
    }));

    it("should add selected song to playlist", function() {
        $scope.search("foo");
        expect(Spotify.search).toHaveBeenCalledWith("foo", "track", { limit: 20 });
    })

    it("should search for spotify track", function() {
        var track = { uri: "foo" };
        $scope.onTrackSelected(track);
        expect(PlayerQueueResource.save).toHaveBeenCalledWith(track);
    })
});
