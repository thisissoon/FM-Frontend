"use strict";

describe("FM.player.PlayerService", function() {

    var service, $q, $httpBackend, $rootScope, PlayerTransportResource, PlayerMuteResource, PlayerVolumeResource;

    beforeEach(function (){
        module("FM.player.PlayerService");
    });

    beforeEach(inject(function (_$httpBackend_) {
        $httpBackend = _$httpBackend_

        $httpBackend.whenGET(/.*player\/mute/).respond(200, { mute: true });
        $httpBackend.whenDELETE(/.*player\/mute/).respond(200, { message: "200 OK" });
        $httpBackend.whenPOST(/.*player\/mute/).respond(200, { message: "200 OK" });

        $httpBackend.whenGET(/.*player\/current/).respond(200, { "name": "some track name" }, { "Paused": 1 });
        $httpBackend.whenDELETE(/.*player\/current/).respond(200, { message: "200 OK" });
        $httpBackend.whenPOST(/.*player\/pause/).respond(200, { message: "200 OK" });
        $httpBackend.whenDELETE(/.*player\/pause/).respond(200, { message: "200 OK" });

        $httpBackend.whenGET(/.*player\/volume/).respond(200, { volume: 70 });
        $httpBackend.whenPOST(/.*player\/volume/).respond(200, { message: "200 OK" });
    }));

    beforeEach(inject(function ($injector, _$rootScope_) {
        service = $injector.get("PlayerService");

        $rootScope = _$rootScope_;
        $q = $injector.get("$q");

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

        service.init();
        $httpBackend.flush();

    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it("should get all current track data on initialisation", function(){
        service.init();
        expect(PlayerTransportResource.get).toHaveBeenCalled();
        expect(PlayerMuteResource.get).toHaveBeenCalled();
        expect(PlayerVolumeResource.get).toHaveBeenCalled();

        $httpBackend.flush();
    });

    it("should make request to resume playback", function(){
        service.resume();
        $httpBackend.flush();
        expect(PlayerTransportResource.resume).toHaveBeenCalled();
    });

    it("should make request to pause playback", function(){
        service.pause();
        $httpBackend.flush();
        expect(PlayerTransportResource.pause).toHaveBeenCalled();
    });

    it("should make request to skip playback", function(){
        service.skip();
        $httpBackend.flush();
        expect(PlayerTransportResource.skip).toHaveBeenCalled();
    });

    it("should make request to update volume", function(){
        service.volume = "70";
        service.updateVol();
        $httpBackend.flush();
        expect(PlayerVolumeResource.save).toHaveBeenCalledWith({ volume: 70 });
    });

    it("should make request to toogle mute", function(){
        service.mute = true;
        service.toggleMute();
        expect(PlayerMuteResource.remove).toHaveBeenCalled();

        $httpBackend.flush();

        service.mute = false;
        service.toggleMute();
        expect(PlayerMuteResource.save).toHaveBeenCalled();

        $httpBackend.flush();
    });

    it("should set paused state `true` on pause event", function() {
        $rootScope.$broadcast("fm:player:pause");
        expect(service.paused).toEqual(true);
    });

    it("should set paused state `false` on resume event", function() {
        $rootScope.$broadcast("fm:player:resume");
        expect(service.paused).toEqual(false);
    });

    it("should set mute state on setMute event", function() {
        var eventData = { mute: true };

        $rootScope.$broadcast("fm:player:setMute", eventData);
        expect(service.mute).toEqual(true);
    });

    it("should set volume state on setVolume event", function() {
        var eventData = { volume: 70 };

        $rootScope.$broadcast("fm:player:setVolume", eventData);
        expect(service.volume).toEqual(70);
    });

    it("should clear the current track on end event", function() {
        expect(service.track).not.toBeNull();
        $rootScope.$broadcast("fm:player:end");
        expect(service.track).toBeNull();
    });


});
