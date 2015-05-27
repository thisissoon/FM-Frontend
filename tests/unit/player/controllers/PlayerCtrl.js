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

    it("should get updated track data if request is successful", function(){
        spyOn($scope, "getAllData");
        $scope.onSuccess({ message: "200 OK" })
        expect($scope.getAllData).not.toHaveBeenCalled();

        $scope.onSuccess({ message: "201 OK" })
        expect($scope.getAllData).toHaveBeenCalled();
    });


    // describe("pause", function(){

    //     it("should set pause state true and make call to PlayerTransportResource.pause", function() {
    //         $scope.pause();
    //         expect(PlayerTransportResource.pause).toHaveBeenCalledWith({});
    //         expect($scope.paused).toEqual(true);
    //     });

    //     it("should show alert if API returns unauthorised status", function() {
    //         spyOn($scope, "showAlert");
    //         response = { message: "401 Unauthorised" };

    //         $scope.pause();
    //         expect(PlayerTransportResource.pause).toHaveBeenCalled();
    //         expect($scope.showAlert).toHaveBeenCalledWith(ERRORS.STATUS_401_TITLE, ERRORS.STATUS_401_MESSAGE);
    //     });

    // });

    // describe("resume", function(){

    //     it("should set pause state false and make call to PlayerTransportResource.resume", function() {
    //         $scope.resume();
    //         expect(PlayerTransportResource.resume).toHaveBeenCalledWith();
    //         expect($scope.paused).toEqual(false);
    //     });

    //     it("should show alert if API returns unauthorised status", function() {
    //         spyOn($scope, "showAlert");
    //         response = { message: "401 Unauthorised" };

    //         $scope.resume();
    //         expect(PlayerTransportResource.resume).toHaveBeenCalled();
    //         expect($scope.showAlert).toHaveBeenCalledWith(ERRORS.STATUS_401_TITLE, ERRORS.STATUS_401_MESSAGE);
    //     });

    // });

    // describe("skip", function() {

    //     it("should make call to PlayerTransportResource.skip", function() {
    //         response = { message: "200 Success" };

    //         $scope.skip();
    //         expect(PlayerTransportResource.skip).toHaveBeenCalledWith();
    //     });

    //     it("should show alert if API returns unauthorised status", function() {
    //         spyOn($scope, "showAlert");
    //         response = { message: "401 Unauthorised" };

    //         $scope.skip();
    //         expect(PlayerTransportResource.skip).toHaveBeenCalled();
    //         expect($scope.showAlert).toHaveBeenCalledWith(ERRORS.STATUS_401_TITLE, ERRORS.STATUS_401_MESSAGE);
    //     });

    // });

    // describe("random", function() {

    //     it("should make call to PlayerRandomResource.save", function() {
    //         response = [ _currentTrack ];

    //         $scope.random();
    //         expect(PlayerRandomResource.save).toHaveBeenCalledWith({ tracks: 1 });
    //     });

    //     it("should show alert if API returns unauthorised status", function() {
    //         spyOn($scope, "showAlert");
    //         response = { message: "401 Unauthorised" };

    //         $scope.random();
    //         expect(PlayerRandomResource.save).toHaveBeenCalled();
    //         expect($scope.showAlert).toHaveBeenCalledWith(ERRORS.STATUS_401_TITLE, ERRORS.STATUS_401_MESSAGE);
    //     });

    // });

    // describe("volumeUp", function() {

    //     it("should increment volume by 5", function() {
    //         $scope.volumeUp();
    //         expect(PlayerVolumeResource.get).toHaveBeenCalled();

    //         expect(_volumeInstance.volume).toEqual(55);
    //         expect(_volumeInstance.$save).toHaveBeenCalled();
    //     });

    //     it("should limit to 100", function() {
    //         _volumeInstance.volume = 100;
    //         $scope.volumeUp();
    //         expect(PlayerVolumeResource.get).toHaveBeenCalled();

    //         expect(_volumeInstance.volume).toEqual(100);
    //         expect(_volumeInstance.$save).toHaveBeenCalled();
    //     });

    // });

    // describe("volumeDown", function() {

    //     it("should decrement volume by 5", function() {
    //         $scope.volumeDown();
    //         expect(PlayerVolumeResource.get).toHaveBeenCalled();

    //         expect(_volumeInstance.volume).toEqual(45);
    //         expect(_volumeInstance.$save).toHaveBeenCalled();
    //     });

    //     it("should limit minimum to 0", function() {
    //         _volumeInstance.volume = 0;
    //         $scope.volumeDown();
    //         expect(PlayerVolumeResource.get).toHaveBeenCalled();

    //         expect(_volumeInstance.volume).toEqual(0);
    //         expect(_volumeInstance.$save).toHaveBeenCalled();
    //     });

    // });

    // describe("toggleMute", function() {

    //     describe("mute", function(){

    //         beforeEach(function(){
    //             $scope.mute = false;
    //         });

    //         it("should set mute state true and save", function() {
    //             response = { message: "201 Created" };

    //             $scope.toggleMute();
    //             expect($scope.mute).toEqual(true);
    //             expect(PlayerMuteResource.save).toHaveBeenCalledWith({ mute: true });
    //         });

    //         it("should show alert if API returns unauthorised status", function() {
    //             spyOn($scope, "showAlert");
    //             response = { message: "401 Unauthorised" };

    //             $scope.toggleMute();
    //             expect($scope.mute).toEqual(false);
    //             expect(PlayerMuteResource.save).toHaveBeenCalled();
    //             expect($scope.showAlert).toHaveBeenCalledWith(ERRORS.STATUS_401_TITLE, ERRORS.STATUS_401_MESSAGE);
    //         });
    //     });

    //     describe("un mute", function(){

    //         beforeEach(function(){
    //             $scope.mute = true;
    //         });

    //         it("should set mute state false and delete", function() {
    //             response = { message: "200 Success" };

    //             $scope.toggleMute();
    //             expect($scope.mute).toEqual(false);
    //             expect(PlayerMuteResource.delete).toHaveBeenCalled();
    //         });

    //         it("should show alert if API returns unauthorised status", function() {
    //             spyOn($scope, "showAlert");
    //             response = { message: "401 Unauthorised" };

    //             $scope.toggleMute();
    //             expect($scope.mute).toEqual(true);
    //             expect(PlayerMuteResource.delete).toHaveBeenCalled();
    //             expect($scope.showAlert).toHaveBeenCalledWith(ERRORS.STATUS_401_TITLE, ERRORS.STATUS_401_MESSAGE);
    //         });
    //     });
    // });

    // describe("refreshPlaylist", function() {

    //     beforeEach(function(){
    //         $scope.playlist = [];
    //         $scope.current = {};
    //         $scope.refreshPlaylist();
    //         $scope.$apply();
    //     });

    //     it("should make request to Queue and Transport resource", function() {
    //         expect(PlayerQueueResource.query).toHaveBeenCalledWith();
    //         expect(PlayerTransportResource.get).toHaveBeenCalledWith();
    //     });

    //     it("should update playlist", function(){
    //         _playlistData.unshift(_currentTrack);
    //         expect($scope.playlist).toEqual(_playlistData);
    //     });

    //     it("should update current", function(){
    //         expect($scope.current).toEqual(_currentTrack);
    //     });
    // });

    // describe("socket event handling", function(){

    //     it("should update playlist on end event", function() {
    //         var eventData = { uri: _currentTrack.track.uri },
    //             expectLength = $scope.playlist.length - 1;

    //         $scope.$broadcast("fm:player:end", eventData);

    //         expect($scope.playlist.length).toEqual(expectLength);
    //     });

    //     it("should call refreshPlaylist on end event if track doesn't match playlist", function() {
    //         var eventData = { uri: "spotify:track:3OYPskZPKnOcHZ9fUDwmCA" },
    //             refreshPlaylist = spyOn($scope, "refreshPlaylist");

    //         $scope.$broadcast("fm:player:end", eventData);

    //         expect(refreshPlaylist).toHaveBeenCalled();
    //     });

    //     it("should update playlist and current on play event", function() {
    //         var eventData = { uri: _playlistData[0].track.uri };

    //         $scope.$broadcast("fm:player:play", eventData);

    //         expect($scope.paused).toEqual(false);
    //         expect($scope.current).toEqual($scope.playlist[0]);
    //         expect($scope.current.track.uri).toEqual(eventData.uri);
    //     });

    //     it("should call refreshPlaylist on play event if track doesn't match playlist", function() {
    //         var eventData = { uri: "spotify:track:3OYPskZPKnOcHZ9fUDwmCA" },
    //             refreshPlaylist = spyOn($scope, "refreshPlaylist");

    //         $scope.$broadcast("fm:player:play", eventData);
    //         expect(refreshPlaylist).toHaveBeenCalled();
    //         expect($scope.paused).toEqual(false);
    //     });

    //     it("should set paused state `true` on pause event", function() {
    //         $scope.$broadcast("fm:player:pause");
    //         expect($scope.paused).toEqual(true);
    //     });

    //     it("should set paused state `false` on resume event", function() {
    //         $scope.$broadcast("fm:player:resume");
    //         expect($scope.paused).toEqual(false);
    //     });

    //     it("should add track to playlist on add event", function() {
    //         var eventData = { uri: _track.uri, user: _user.id },
    //             expectedLength = $scope.playlist.length + 1;

    //         $scope.$broadcast("fm:player:add", eventData);
    //         $scope.$apply();

    //         expect(TracksResource.get).toHaveBeenCalledWith({ id: _track.uri });
    //         expect(UsersResource.get).toHaveBeenCalledWith({ id: _user.id });
    //         expect($scope.playlist.length).toEqual(expectedLength);
    //         expect($scope.playlist[3]).toEqual({ track: _track, user: _user });
    //     });

    //     it("should set mute state on setMute event", function() {
    //         var eventData = { mute: true };

    //         $scope.$broadcast("fm:player:setMute", eventData);
    //         expect($scope.mute).toEqual(true);
    //     });

    // });

});
