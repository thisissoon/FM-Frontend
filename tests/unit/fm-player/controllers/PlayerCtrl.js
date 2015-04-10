"use strict";

describe("sn.fm.player:PlayerCtrl", function() {

    var $scope, $q, PlayerMuteResource, PlayerQueueResource, PlayerTransportResource, PlayerVolumeResource, TracksResource, UsersResource, PlayerRandomResource,
        queueCallback, currentCallback, trackCallback, userCallback, mockPlayerVolumeResource,
        genericCallback, response,
        ERRORS, _volumeInstance, _playlistData, _currentTrack, _track, _user, _muteState;

    beforeEach(function (){
        module("sn.fm.player");
    });

    beforeEach(inject(function ($httpBackend) {
        $httpBackend.whenGET(/.*/).respond(200, []);
    }));

    beforeEach(inject(function ( $rootScope, $injector, $controller ) {
        $scope = $rootScope.$new();
        $q = $injector.get("$q");

        ERRORS = $injector.get("ERRORS");

        queueCallback = function(){
            return {
                $promise: {
                    then: function(fn){ fn.apply(this,[_playlistData]) }
                }
            }
        }
        currentCallback = function(){
            return {
                $promise: {
                    then: function(fn){ fn.apply(this,[_currentTrack]) }
                }
            }
        }
        trackCallback = function(){
            return {
                $promise: {
                    then: function(fn){ fn.apply(this,[_track]) }
                }
            }
        }
        userCallback = function(){
            return {
                $promise: {
                    then: function(fn){ fn.apply(this,[_user]) }
                }
            }
        }

        response = { message: "200 Success" };
        genericCallback = function(){
            return {
                $promise: {
                    then: function(fn){ fn.apply(this,[response])}
                }
            }
        }

        _volumeInstance = { volume: 50, $save: function(){} }
        mockPlayerVolumeResource = function(params, success){
            success.apply(this, [_volumeInstance])
        };

        PlayerMuteResource = $injector.get("PlayerMuteResource");
        spyOn(PlayerMuteResource, "get");
        spyOn(PlayerMuteResource, "save").and.callFake(genericCallback);
        spyOn(PlayerMuteResource, "delete").and.callFake(genericCallback);

        PlayerQueueResource = $injector.get("PlayerQueueResource");
        spyOn(PlayerQueueResource, "save");
        spyOn(PlayerQueueResource, "query").and.callFake(queueCallback);

        PlayerTransportResource = $injector.get("PlayerTransportResource");
        spyOn(PlayerTransportResource, "get").and.callFake(currentCallback);
        spyOn(PlayerTransportResource, "resume").and.callFake(genericCallback);
        spyOn(PlayerTransportResource, "pause").and.callFake(genericCallback);
        spyOn(PlayerTransportResource, "skip").and.callFake(genericCallback);

        PlayerVolumeResource = $injector.get("PlayerVolumeResource");
        spyOn(PlayerVolumeResource, "get").and.callFake(mockPlayerVolumeResource);
        spyOn(_volumeInstance, "$save");

        TracksResource = $injector.get("TracksResource");
        spyOn(TracksResource, "get").and.callFake(trackCallback);

        UsersResource = $injector.get("UsersResource");
        spyOn(UsersResource, "get").and.callFake(userCallback);

        PlayerRandomResource = $injector.get("PlayerRandomResource");
        spyOn(PlayerRandomResource, "save").and.callFake(genericCallback);

        _playlistData = [{
            "track": {
                "album" : {
                    "id" : "4b170737-017c-4e85-965c-47b8a158c785",
                    "images" : [ {
                        "height" : 640,
                        "url" : "https://i.scdn.co/image/e1c8594562d35cd8d4338bfeb6c6b23bd41fd942",
                        "width" : 640
                    }, {
                        "height" : 300,
                        "url" : "https://i.scdn.co/image/ca4b85e01309d843d615b8ab93d312742650e46d",
                        "width" : 300
                    }, {
                        "height" : 64,
                        "url" : "https://i.scdn.co/image/e76deee80fb59daef5f531d08e2fc156c9bdff9a",
                        "width" : 64
                    } ],
                    "name" : "Brothers (Deluxe Edition)",
                    "uri" : "spotify:album:0gVxPZ2tcMgyzLxyw8k1z7"
                },
                "artists" : [ {
                    "id" : "4b170737-017c-4e85-965c-47b8a158c787",
                    "name" : "The Black Keys",
                    "uri" : "spotify:artist:7mnBLXK823vNxN3UWB7Gfz"
                } ],
                "duration" : 204626,
                "id" : "4b170737-017c-4e85-965c-47b8a158c784",
                "name" : "Everlasting Light",
                "uri" : "spotify:track:3OYPskZPKnOcHZ9fUDwmCK"
            },
            "user": _user,
        }, {
            "track": {
                "album" : {
                    "id" : "4b170737-017c-4e85-965c-47b8a158c786",
                    "images" : [ {
                        "height" : 640,
                        "url" : "https://i.scdn.co/image/b26866432cca1c107c3fa6f5fee5c80995d99e75",
                        "width" : 640
                    }, {
                        "height" : 300,
                        "url" : "https://i.scdn.co/image/db5b7075ed0d352dae4d36e5f1af9d1c57d4c046",
                        "width" : 300
                    }, {
                        "height" : 64,
                        "url" : "https://i.scdn.co/image/ccf3a54fae2aa343a4bab5b75279c70f889c6612",
                        "width" : 64
                    } ],
                    "name" : "Lonely Boy",
                    "sptofy_uri" : "spotify:album:2uGi7bQZU5My0k1UGJQRz2"
                },
                "artists" : [ {
                    "id" : "4b170737-017c-4e85-965c-47b8a158c787",
                    "name" : "The Black Keys",
                    "uri" : "spotify:artist:7mnBLXK823vNxN3UWB7Gfz"
                } ],
                "duration" : 193173,
                "id" : "4b170737-017c-4e85-965c-47b8a158c788",
                "name" : "Lonely Boy",
                "uri" : "spotify:track:3dOAXUx7I1qnzWzxdnsyB8"
            },
            "user": _user,
        }]

        _track = {
            "album": {
                "artists": [
                    {
                        "id": "26556f7e-3304-4e51-8243-dd2199fcf6fa",
                        "name": "Nightwish",
                        "uri": "spotify:artist:2NPduAUeLVsfIauhRwuft1"
                    }
                ],
                "id": "7f8bda77-5364-4902-9a98-208f1cdd7643",
                "images": [
                    {
                        "height": 640,
                        "url": "https://i.scdn.co/image/7928fc9bd902b917aae0ef1bee41cb51598a2d27",
                        "width": 640
                    },
                    {
                        "height": 300,
                        "url": "https://i.scdn.co/image/e80cb4d324d16881e2f7653abdbd70497bbab68d",
                        "width": 300
                    },
                    {
                        "height": 64,
                        "url": "https://i.scdn.co/image/bf567406035a8e2b162c6a23470c6cdd5dd560f3",
                        "width": 64
                    }
                ],
                "name": "Showtime, Storytime",
                "uri": "spotify:album:1tZlCjdI2dcfBXP8iSDsSI"
            },
            "duration": 272906,
            "id": "4b170737-017c-4e85-965c-47b8a158c789",
            "name": "Dark Chest Of Wonders - Live @ Wacken 2013",
            "uri": "spotify:track:6FshvOVICpRVkwpYE5BYTD"
        }

        _user = {
            "avatar_url": "https://lh5.googleusercontent.com/-8zjhd-e4yZA/AAAAAAAAAAI/AAAAAAAAAFU/NiS1oH4gAKo/photo.jpg",
            "display_name": "Chris Reeves",
            "family_name": "Reeves",
            "given_name": "Chris",
            "id": "8258be6b-ee53-4186-8bbd-55bc0a3a6f24"
        }

        _currentTrack = {
            "track": _track,
            "user": _user,
            "paused": 0
        }

        _muteState = {
            mute: true
        }

        $controller("PlayerCtrl", {
            $scope: $scope,
            $q: $q,
            PlayerMuteResource: PlayerMuteResource,
            PlayerQueueResource: PlayerQueueResource,
            PlayerTransportResource: PlayerTransportResource,
            PlayerVolumeResource: PlayerVolumeResource,
            TracksResource: TracksResource,
            PlayerRandomResource: PlayerRandomResource,
            playlistData: _playlistData,
            currentTrack: _currentTrack,
            muteState: _muteState,
            ERRORS: ERRORS
        });
    }));

    it("should attach resolved data to scope", function() {
        expect($scope.playlist).toEqual(_playlistData);
        expect($scope.current).toEqual(_currentTrack);
        expect($scope.paused).toEqual(_currentTrack.paused);
        expect($scope.mute).toEqual(_muteState.mute);
    });

    it("should add current track to playlist on init", function() {
        expect($scope.playlist[0]).toEqual(_currentTrack);
        expect($scope.playlist.length).toEqual(3);
    });

    describe("pause", function(){

        it("should set pause state true and make call to PlayerTransportResource.pause", function() {
            $scope.pause();
            expect(PlayerTransportResource.pause).toHaveBeenCalledWith({});
            expect($scope.paused).toEqual(true);
        });

        it("should show alert if API returns unauthorised status", function() {
            spyOn($scope, "showAlert");
            response = { message: "401 Unauthorised" };

            $scope.pause();
            expect(PlayerTransportResource.pause).toHaveBeenCalled();
            expect($scope.showAlert).toHaveBeenCalledWith(ERRORS.STATUS_401_TITLE, ERRORS.STATUS_401_MESSAGE);
        });

    });

    describe("resume", function(){

        it("should set pause state false and make call to PlayerTransportResource.resume", function() {
            $scope.resume();
            expect(PlayerTransportResource.resume).toHaveBeenCalledWith();
            expect($scope.paused).toEqual(false);
        });

        it("should show alert if API returns unauthorised status", function() {
            spyOn($scope, "showAlert");
            response = { message: "401 Unauthorised" };

            $scope.resume();
            expect(PlayerTransportResource.resume).toHaveBeenCalled();
            expect($scope.showAlert).toHaveBeenCalledWith(ERRORS.STATUS_401_TITLE, ERRORS.STATUS_401_MESSAGE);
        });

    });

    describe("skip", function() {

        it("should make call to PlayerTransportResource.skip", function() {
            response = { message: "200 Success" };

            $scope.skip();
            expect(PlayerTransportResource.skip).toHaveBeenCalledWith();
        });

        it("should show alert if API returns unauthorised status", function() {
            spyOn($scope, "showAlert");
            response = { message: "401 Unauthorised" };

            $scope.skip();
            expect(PlayerTransportResource.skip).toHaveBeenCalled();
            expect($scope.showAlert).toHaveBeenCalledWith(ERRORS.STATUS_401_TITLE, ERRORS.STATUS_401_MESSAGE);
        });

    });

    describe("random", function() {

        it("should make call to PlayerRandomResource.save", function() {
            response = [ _currentTrack ];

            $scope.random();
            expect(PlayerRandomResource.save).toHaveBeenCalledWith({ tracks: 1 });
        });

        it("should show alert if API returns unauthorised status", function() {
            spyOn($scope, "showAlert");
            response = { message: "401 Unauthorised" };

            $scope.random();
            expect(PlayerRandomResource.save).toHaveBeenCalled();
            expect($scope.showAlert).toHaveBeenCalledWith(ERRORS.STATUS_401_TITLE, ERRORS.STATUS_401_MESSAGE);
        });

    });

    describe("volumeUp", function() {

        it("should increment volume by 5", function() {
            $scope.volumeUp();
            expect(PlayerVolumeResource.get).toHaveBeenCalled();

            expect(_volumeInstance.volume).toEqual(55);
            expect(_volumeInstance.$save).toHaveBeenCalled();
        });

        it("should limit to 100", function() {
            _volumeInstance.volume = 100;
            $scope.volumeUp();
            expect(PlayerVolumeResource.get).toHaveBeenCalled();

            expect(_volumeInstance.volume).toEqual(100);
            expect(_volumeInstance.$save).toHaveBeenCalled();
        });

    });

    describe("volumeDown", function() {

        it("should decrement volume by 5", function() {
            $scope.volumeDown();
            expect(PlayerVolumeResource.get).toHaveBeenCalled();

            expect(_volumeInstance.volume).toEqual(45);
            expect(_volumeInstance.$save).toHaveBeenCalled();
        });

        it("should limit minimum to 0", function() {
            _volumeInstance.volume = 0;
            $scope.volumeDown();
            expect(PlayerVolumeResource.get).toHaveBeenCalled();

            expect(_volumeInstance.volume).toEqual(0);
            expect(_volumeInstance.$save).toHaveBeenCalled();
        });

    });

    describe("toggleMute", function() {

        describe("mute", function(){

            beforeEach(function(){
                $scope.mute = false;
            });

            it("should set mute state true and save", function() {
                response = { message: "201 Created" };

                $scope.toggleMute();
                expect($scope.mute).toEqual(true);
                expect(PlayerMuteResource.save).toHaveBeenCalledWith({ mute: true });
            });

            it("should show alert if API returns unauthorised status", function() {
                spyOn($scope, "showAlert");
                response = { message: "401 Unauthorised" };

                $scope.toggleMute();
                expect($scope.mute).toEqual(false);
                expect(PlayerMuteResource.save).toHaveBeenCalled();
                expect($scope.showAlert).toHaveBeenCalledWith(ERRORS.STATUS_401_TITLE, ERRORS.STATUS_401_MESSAGE);
            });
        });

        describe("un mute", function(){

            beforeEach(function(){
                $scope.mute = true;
            });

            it("should set mute state false and delete", function() {
                response = { message: "200 Success" };

                $scope.toggleMute();
                expect($scope.mute).toEqual(false);
                expect(PlayerMuteResource.delete).toHaveBeenCalled();
            });

            it("should show alert if API returns unauthorised status", function() {
                spyOn($scope, "showAlert");
                response = { message: "401 Unauthorised" };

                $scope.toggleMute();
                expect($scope.mute).toEqual(true);
                expect(PlayerMuteResource.delete).toHaveBeenCalled();
                expect($scope.showAlert).toHaveBeenCalledWith(ERRORS.STATUS_401_TITLE, ERRORS.STATUS_401_MESSAGE);
            });
        });
    });

    describe("refreshPlaylist", function() {

        beforeEach(function(){
            $scope.playlist = [];
            $scope.current = {};
            $scope.refreshPlaylist();
            $scope.$apply();
        });

        it("should make request to Queue and Transport resource", function() {
            expect(PlayerQueueResource.query).toHaveBeenCalledWith();
            expect(PlayerTransportResource.get).toHaveBeenCalledWith();
        });

        it("should update playlist", function(){
            _playlistData.unshift(_currentTrack);
            expect($scope.playlist).toEqual(_playlistData);
        });

        it("should update current", function(){
            expect($scope.current).toEqual(_currentTrack);
        });
    });

    describe("socket event handling", function(){

        it("should update playlist on end event", function() {
            var eventData = { uri: _currentTrack.track.uri },
                expectLength = $scope.playlist.length - 1;

            $scope.$broadcast("fm:player:end", eventData);

            expect($scope.playlist.length).toEqual(expectLength);
        });

        it("should call refreshPlaylist on end event if track doesn't match playlist", function() {
            var eventData = { uri: "spotify:track:3OYPskZPKnOcHZ9fUDwmCA" },
                refreshPlaylist = spyOn($scope, "refreshPlaylist");

            $scope.$broadcast("fm:player:end", eventData);

            expect(refreshPlaylist).toHaveBeenCalled();
        });

        it("should update playlist and current on play event", function() {
            var eventData = { uri: _playlistData[0].track.uri };

            $scope.$broadcast("fm:player:play", eventData);

            expect($scope.paused).toEqual(false);
            expect($scope.current).toEqual($scope.playlist[0]);
            expect($scope.current.track.uri).toEqual(eventData.uri);
        });

        it("should call refreshPlaylist on play event if track doesn't match playlist", function() {
            var eventData = { uri: "spotify:track:3OYPskZPKnOcHZ9fUDwmCA" },
                refreshPlaylist = spyOn($scope, "refreshPlaylist");

            $scope.$broadcast("fm:player:play", eventData);
            expect(refreshPlaylist).toHaveBeenCalled();
            expect($scope.paused).toEqual(false);
        });

        it("should set paused state `true` on pause event", function() {
            $scope.$broadcast("fm:player:pause");
            expect($scope.paused).toEqual(true);
        });

        it("should set paused state `false` on resume event", function() {
            $scope.$broadcast("fm:player:resume");
            expect($scope.paused).toEqual(false);
        });

        it("should add track to playlist on add event", function() {
            var eventData = { uri: _track.uri, user: _user.id },
                expectedLength = $scope.playlist.length + 1;

            $scope.$broadcast("fm:player:add", eventData);
            $scope.$apply();

            expect(TracksResource.get).toHaveBeenCalledWith({ id: _track.uri });
            expect(UsersResource.get).toHaveBeenCalledWith({ id: _user.id });
            expect($scope.playlist.length).toEqual(expectedLength);
            expect($scope.playlist[3]).toEqual({ track: _track, user: _user });
        });

        it("should set mute state on setMute event", function() {
            var eventData = { mute: true };

            $scope.$broadcast("fm:player:setMute", eventData);
            expect($scope.mute).toEqual(true);
        });

    });

});
