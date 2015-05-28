"use strict";

describe("FM.player.PlayerCtrl", function() {

    var $scope, $q, $httpBackend, PlayerTransportResource, PlayerMuteResource, PlayerVolumeResource, ERRORS;

    beforeEach(function (){
        module("FM.player.PlayerCtrl");
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

    beforeEach(inject(function ( $rootScope, $injector, $controller ) {
        $scope = $rootScope.$new();
        $q = $injector.get("$q");

        ERRORS = $injector.get("ERRORS");

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
            PlayerTransportResource: PlayerTransportResource,
            PlayerMuteResource: PlayerMuteResource,
            PlayerVolumeResource: PlayerVolumeResource,
            ERRORS: ERRORS
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
        $scope.volume = 70;
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
