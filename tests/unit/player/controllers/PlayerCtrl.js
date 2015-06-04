"use strict";

describe("FM.player.PlayerCtrl", function() {

    var $scope, $q, $httpBackend, $notification,
        PlayerTransportResource, PlayerMuteResource, PlayerVolumeResource;

    beforeEach(function (){
        module("FM.player.PlayerCtrl");
    });

    beforeEach(inject(function (_$httpBackend_) {
        $httpBackend = _$httpBackend_

        $httpBackend.whenGET(/.*player\/mute/).respond(200, { mute: true });
        $httpBackend.whenDELETE(/.*player\/mute/).respond(200, { message: "200 OK" });
        $httpBackend.whenPOST(/.*player\/mute/).respond(200, { message: "200 OK" });

        $httpBackend.whenGET(/.*player\/current/).respond(200, {"track": {"album": {"id": "d7b737a9-d70b-49a9-9f42-8c204b342000", "images": [{"url": "http://placehold.it/640x629?text=Album+Art", "width": 640, "height": 629}, {"url": "http://placehold.it/300x295?text=Album+Art", "width": 300, "height": 295}, {"url": "http://placehold.it/64x63?text=Album+Art", "width": 64, "height": 63}], "name": "Boston", "uri": "spotify:album:2QLp07RO6anZHmtcKTEvSC"}, "name": "More Than a Feeling", "uri": "spotify:track:1QEEqeFIZktqIpPI4jSVSF", "play_count": 0, "artists": [{"id": "8c22640a-02ef-4ee0-90eb-87c9c9a2534f", "uri": "spotify:artist:29kkCKKGXheHuoO829FxWK", "name": "Boston"}], "duration": 285133, "id": "0739b113-ad3a-47a4-bea9-edb00ba192f5"}, "user": {"family_name": "Light", "display_name": "Alex Light", "avatar_url": "http://placehold.it/400", "spotify_playlists": null, "given_name": "Alex", "id": "16369f65-6aa5-4d04-8927-a77016d0d721"}}, { "Paused": 1 });
        $httpBackend.whenDELETE(/.*player\/current/).respond(200, { message: "200 OK" });
        $httpBackend.whenPOST(/.*player\/pause/).respond(200, { message: "200 OK" });
        $httpBackend.whenDELETE(/.*player\/pause/).respond(200, { message: "200 OK" });

        $httpBackend.whenGET(/.*player\/volume/).respond(200, { volume: 70 });
        $httpBackend.whenPOST(/.*player\/volume/).respond(200, { message: "200 OK" });
    }));

    beforeEach(inject(function ( $rootScope, $injector, $controller ) {
        $scope = $rootScope.$new();
        $q = $injector.get("$q");
        $notification = jasmine.createSpy();

        PlayerMuteResource = $injector.get("PlayerMuteResource");
        spyOn(PlayerMuteResource, "get").and.callThrough();
        spyOn(PlayerMuteResource, "remove").and.callThrough();
        spyOn(PlayerMuteResource, "save").and.callThrough();

        PlayerTransportResource = $injector.get("PlayerTransportResource");
        spyOn(PlayerTransportResource, "get").and.callThrough();
        spyOn(PlayerTransportResource, "resume").and.callThrough();
        spyOn(PlayerTransportResource, "pause").and.callThrough();
        spyOn(PlayerTransportResource, "skip").and.callThrough();

        PlayerVolumeResource = $injector.get("PlayerVolumeResource");
        spyOn(PlayerVolumeResource, "get").and.callThrough();
        spyOn(PlayerVolumeResource, "save").and.callThrough();

        $controller("PlayerCtrl", {
            $scope: $scope,
            $q: $q,
            $notification: $notification,
            PlayerTransportResource: PlayerTransportResource,
            PlayerMuteResource: PlayerMuteResource,
            PlayerVolumeResource: PlayerVolumeResource
        });

        $httpBackend.flush();

    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it("should get all current track data", function(){
        $scope.getAllData();
        $scope.$apply();
        expect(PlayerTransportResource.get).toHaveBeenCalled();
        expect(PlayerMuteResource.get).toHaveBeenCalled();
        expect(PlayerVolumeResource.get).toHaveBeenCalled();

        $httpBackend.flush();
        expect($notification).toHaveBeenCalledWith("Now Playing", { body: "Boston - Boston: More Than a Feeling", icon: "http://placehold.it/640x629?text=Album+Art" });
    });

    it("should make request to resume playback", function(){
        $scope.resume();
        $httpBackend.flush();
        expect(PlayerTransportResource.resume).toHaveBeenCalled();
    });

    it("should make request to pause playback", function(){
        $scope.pause();
        $httpBackend.flush();
        expect(PlayerTransportResource.pause).toHaveBeenCalled();
    });

    it("should make request to skip playback", function(){
        $scope.skip();
        $httpBackend.flush();
        expect(PlayerTransportResource.skip).toHaveBeenCalled();
    });

    it("should make request to update volume", function(){
        $scope.volume = "70";
        $scope.updateVol();
        $httpBackend.flush();
        expect(PlayerVolumeResource.save).toHaveBeenCalledWith({ volume: 70 });
    });

    it("should make request to toogle mute", function(){
        $scope.mute = true;
        $scope.toggleMute();
        expect(PlayerMuteResource.remove).toHaveBeenCalled();

        $httpBackend.flush();

        $scope.mute = false;
        $scope.toggleMute();
        expect(PlayerMuteResource.save).toHaveBeenCalled();

        $httpBackend.flush();
    });

    it("should set paused state `true` on pause event", function() {
        $scope.$broadcast("fm:player:pause");
        expect($scope.paused).toEqual(true);
    });

    it("should set paused state `false` on resume event", function() {
        $scope.$broadcast("fm:player:resume");
        expect($scope.paused).toEqual(false);
    });

    it("should set mute state on setMute event", function() {
        var eventData = { mute: true };

        $scope.$broadcast("fm:player:setMute", eventData);
        expect($scope.mute).toEqual(true);
    });

    it("should set volume state on setVolume event", function() {
        var eventData = { volume: 70 };

        $scope.$broadcast("fm:player:setVolume", eventData);
        expect($scope.volume).toEqual(70);
    });

    it("should clear the current track on end event", function() {
        expect($scope.track).not.toBeNull();
        $scope.$broadcast("fm:player:end");
        expect($scope.track).toBeNull();
    });

    it("should set mute status to true", function() {
        $scope.onMute();
        expect($scope.mute).toBe(true);
    });

    it("should set mute status to false", function() {
        $scope.onUnmute();
        expect($scope.mute).toBe(false);
    });

});
