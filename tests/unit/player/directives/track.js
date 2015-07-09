"use strict";

describe("FM.player.trackDirective", function() {
    var element, $scope, $rootScope, isolatedScope, $templateCache, PlayerQueueResource;

    beforeEach(function(){
        module("FM.player.trackDirective")
        module(function ($provide) {
            $provide.provider("PlayerQueueResource", function () {
                this.$get = function () {
                    PlayerQueueResource = {
                        save: jasmine.createSpy("PlayerQueueResource.save")
                    }
                    return PlayerQueueResource;
                }
            })
        })
    });

    beforeEach(inject(function (_$rootScope_, $compile, $injector) {
        $rootScope = _$rootScope_;

        $rootScope.mySpotifyTrackObject = {
            artists: [
                { name: "foo" },
                { name: "bar" }
            ]
        }

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
