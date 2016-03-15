"use strict";

describe("FM.player.trackDirective", function() {
    var element, $scope, $rootScope, isolatedScope, $templateCache, $httpBackend, PlayerQueueResource;

    beforeEach(module("FM.player.trackDirective"));

    beforeEach(inject(function (_$httpBackend_) {
        $httpBackend = _$httpBackend_

        $httpBackend.whenPOST(/.*player\/queue/).respond(200, [{ track: { uri: "foo" } },{ track: { uri: "bar" } }]);
        $httpBackend.whenDELETE(/.*player\/queue/).respond(200);
    }));

    beforeEach(inject(function (_$rootScope_, $compile, $injector) {
        $rootScope = _$rootScope_;

        $rootScope.mySpotifyTrackObject = {
            artists: [
                { name: "foo" },
                { name: "bar" }
            ]
        }

        PlayerQueueResource = $injector.get("PlayerQueueResource");
        spyOn(PlayerQueueResource, "save").and.callThrough();
        spyOn(PlayerQueueResource, "remove").and.callThrough();

        $scope = $rootScope.$new();

        element = "<fm-track spotify-track=\"mySpotifyTrackObject\"></fm-track>";

        $templateCache = $injector.get("$templateCache");
        $templateCache.put("partials/track.html", "foo");

        element = $compile(element)($scope);
        $scope.$digest();

        isolatedScope = element.isolateScope();

    }));

    it("should render directive", function(){
        expect(element.html()).toContain("foo");
    });

    it("should concat artist names", function(){
        expect(isolatedScope.track.allArtists).toEqual("foo, bar");
    })

    it("should clear concat artist names", function(){
        expect(isolatedScope.track.allArtists).toEqual("foo, bar");

        isolatedScope.onTrackUpdate({ artists: [] });
        expect(isolatedScope.track.allArtists).toEqual("");

        isolatedScope.onTrackUpdate({});
        expect(isolatedScope.track.allArtists).toEqual("");

        isolatedScope.onTrackUpdate();
        expect(isolatedScope.track.allArtists).toEqual("");
    })

    it("should add track to playlist", function(){
        isolatedScope.addToPlaylist({ uri: "123" });
        expect(PlayerQueueResource.save).toHaveBeenCalledWith({ uri: "123" });

        isolatedScope.addToPlaylist({ spotify_uri: "456" });
        expect(PlayerQueueResource.save.calls.argsFor(1)).toEqual([{ uri: "456" }]);
    })

    it("should NOT add track to playlist", function(){
        isolatedScope.addToPlaylist({ uri: undefined });
        expect(PlayerQueueResource.save).not.toHaveBeenCalled();
    })

    it("should remove track from playlist", function(){
        isolatedScope.removeTrack("123");
        expect(PlayerQueueResource.remove).toHaveBeenCalledWith({ id: "123" });
    })

});
