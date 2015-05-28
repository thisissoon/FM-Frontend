"use strict";

describe("FM.search.SearchCtrl", function() {

    var $scope, $rootScope, $q, Spotify, PlayerQueueResource, spotifyCallback;

    beforeEach(function (){
        module("FM.search.SearchCtrl");
    });

    beforeEach(inject(function ($httpBackend) {
        $httpBackend.whenGET(/.*/).respond(200, []);
    }));

    beforeEach(inject(function ( $rootScope, $injector, $controller ) {
        $scope = $rootScope.$new();
        $rootScope = $rootScope;

        $rootScope.toogleSidebar = function(){}

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
        spyOn(PlayerQueueResource, "save").and.callFake(function(){
            return {
                $promise: {
                    then: function(fn){
                        fn.apply(this,[]);
                    }
                }
            }
        });

        $controller("SearchCtrl", {
            $scope: $scope,
            $rootScope: $rootScope,
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
