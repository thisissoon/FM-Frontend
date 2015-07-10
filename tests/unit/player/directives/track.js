"use strict";

describe("FM.player.trackDirective", function() {
    var element, $scope, $rootScope, isolatedScope, $templateCache, $httpBackend, PlayerQueueResource;

    beforeEach(module("FM.player.trackDirective"));

    beforeEach(inject(function (_$httpBackend_) {
        $httpBackend = _$httpBackend_

        $httpBackend.whenPOST(/.*player\/queue/).respond(200, [{ track: { uri: "foo" } },{ track: { uri: "bar" } }]);
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
    })

});
