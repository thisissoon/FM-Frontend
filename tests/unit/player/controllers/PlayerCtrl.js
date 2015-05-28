"use strict";

describe("FM.player.PlayerCtrl", function() {

    var $scope, $q, PlayerTransportResource, PlayerMuteResource, PlayerVolumeResource, ERRORS,
        muteCallback, transportCallback, volumeCallback;

    beforeEach(function (){
        module("FM.player.PlayerCtrl");
    });

    beforeEach(inject(function ( $rootScope, $injector, $controller ) {
        $scope = $rootScope.$new();
        $q = $injector.get("$q");

        muteCallback = function(){
            return {
                $promise: {
                    then: function(fn){
                        fn.apply(this, [{ mute: true }]);
                    }
                }
            }
        }

        transportCallback = function(){
            return {
                $promise: {
                    then: function(fn){
                        fn.apply(this, [{ track: { uri: "foo" } }]);
                    }
                }
            }
        }

        volumeCallback = function(){
            return {
                $promise: {
                    then: function(fn){
                        fn.apply(this, [{ volume: 70 }]);
                    }
                }
            }
        }

        ERRORS = $injector.get("ERRORS");

        PlayerMuteResource = $injector.get("PlayerMuteResource");
        spyOn(PlayerMuteResource, "get").and.callFake(muteCallback);
        spyOn(PlayerMuteResource, "remove").and.callFake(muteCallback);
        spyOn(PlayerMuteResource, "save").and.callFake(muteCallback);

        PlayerTransportResource = $injector.get("PlayerTransportResource");
        spyOn(PlayerTransportResource, "get").and.callFake(transportCallback);
        spyOn(PlayerTransportResource, "resume").and.callFake(transportCallback);
        spyOn(PlayerTransportResource, "pause").and.callFake(transportCallback);
        spyOn(PlayerTransportResource, "skip").and.callFake(transportCallback);

        PlayerVolumeResource = $injector.get("PlayerVolumeResource");
        spyOn(PlayerVolumeResource, "get").and.callFake(volumeCallback);
        spyOn(PlayerVolumeResource, "save").and.callFake(volumeCallback);

        $controller("PlayerCtrl", {
            $scope: $scope,
            $q: $q,
            PlayerTransportResource: PlayerTransportResource,
            PlayerMuteResource: PlayerMuteResource,
            PlayerVolumeResource: PlayerVolumeResource,
            ERRORS: ERRORS
        });
    }));

    it("should get all current track data", function(){
        $scope.getAllData();
        $scope.$apply();
        expect(PlayerTransportResource.get).toHaveBeenCalled();
        expect(PlayerMuteResource.get).toHaveBeenCalled();
        expect(PlayerVolumeResource.get).toHaveBeenCalled();
    });

    it("should make request to resume playback", function(){
        $scope.resume();
        expect(PlayerTransportResource.resume).toHaveBeenCalled();
    });

    it("should make request to pause playback", function(){
        $scope.pause();
        expect(PlayerTransportResource.pause).toHaveBeenCalled();
    });

    it("should make request to skip playback", function(){
        $scope.skip();
        expect(PlayerTransportResource.skip).toHaveBeenCalled();
    });

    it("should make request to update volume", function(){
        $scope.volume = 70;
        $scope.updateVol();
        expect(PlayerVolumeResource.save).toHaveBeenCalledWith({ volume: 70 });
    });

    it("should make request to toogle mute", function(){
        $scope.mute = true;
        $scope.toggleMute();
        expect(PlayerMuteResource.remove).toHaveBeenCalled();

        $scope.mute = false;
        $scope.toggleMute();
        expect(PlayerMuteResource.save).toHaveBeenCalled();
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
        expect($scope.track).toBeNull();;
    });

});
