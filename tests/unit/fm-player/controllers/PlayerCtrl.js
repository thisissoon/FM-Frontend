"use strict";

describe("sn.fm.player:PlayerCtrl", function() {

    var $scope, $q, Spotify, PlayerQueueResource, PlayerTransportResource, TracksResource, spotifyCallback, queueCallback, transportCallback, trackCallback, _playlistData, _currentTrack;

    beforeEach(function (){
        module("sn.fm.player");
    });

    beforeEach(inject(function ($httpBackend) {
        $httpBackend.whenGET(/.*/).respond(200, []);
    }));

    beforeEach(inject(function ( $rootScope, $injector, $controller ) {
        $scope = $rootScope.$new();
        $q = $injector.get("$q");

        spotifyCallback = function(){
            return {
                then: function(fn){
                    fn.apply(this,[{ tracks: { items: [] } }])
                }
            }
        }

        queueCallback = function(){
            return {
                $promise: {
                    then: function(fn){
                        fn.apply(this,[_playlistData])
                    }
                }
            }
        }
        transportCallback = function(){
            return {
                $promise: {
                    then: function(fn){
                        fn.apply(this,[_currentTrack])
                    }
                }
            }
        }
        trackCallback = function(){
            return {
                $promise: {
                    then: function(fn){
                        fn.apply(this,[_currentTrack.track])
                    }
                }
            }
        }

        Spotify = {
            search: function(){}
        }
        spyOn(Spotify, "search").and.callFake(spotifyCallback);

        PlayerQueueResource = $injector.get("PlayerQueueResource");
        spyOn(PlayerQueueResource, "save");
        spyOn(PlayerQueueResource, "query").and.callFake(queueCallback);

        PlayerTransportResource = $injector.get("PlayerTransportResource");
        spyOn(PlayerTransportResource, "get").and.callFake(transportCallback);

        TracksResource = $injector.get("TracksResource");
        spyOn(TracksResource, "get").and.callFake(trackCallback);

        _playlistData = [{
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
                "spotify_uri" : "spotify:album:0gVxPZ2tcMgyzLxyw8k1z7"
            },
            "artists" : [ {
                "id" : "4b170737-017c-4e85-965c-47b8a158c787",
                "name" : "The Black Keys",
                "spotify_uri" : "spotify:artist:7mnBLXK823vNxN3UWB7Gfz"
            } ],
            "duration" : 204626,
            "id" : "4b170737-017c-4e85-965c-47b8a158c784",
            "name" : "Everlasting Light",
            "spotify_uri" : "spotify:track:3OYPskZPKnOcHZ9fUDwmCK"
        }, {
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
                "spotify_uri" : "spotify:artist:7mnBLXK823vNxN3UWB7Gfz"
            } ],
            "duration" : 193173,
            "id" : "4b170737-017c-4e85-965c-47b8a158c788",
            "name" : "Lonely Boy",
            "spotify_uri" : "spotify:track:3dOAXUx7I1qnzWzxdnsyB8"
        }]

        _currentTrack = {
            paused: 0,
            status: 200,
            track: {
                "album": {
                    "artists": [
                        {
                            "id": "26556f7e-3304-4e51-8243-dd2199fcf6fa",
                            "name": "Nightwish",
                            "spotify_uri": "spotify:artist:2NPduAUeLVsfIauhRwuft1"
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
                    "spotify_uri": "spotify:album:1tZlCjdI2dcfBXP8iSDsSI"
                },
                "duration": 272906,
                "id": "4b170737-017c-4e85-965c-47b8a158c789",
                "name": "Dark Chest Of Wonders - Live @ Wacken 2013",
                "spotify_uri": "spotify:track:6FshvOVICpRVkwpYE5BYTD"
            }
        }

        $controller("PlayerCtrl", {
            $scope: $scope,
            $q: $q,
            Spotify: Spotify,
            PlayerQueueResource: PlayerQueueResource,
            PlayerTransportResource: PlayerTransportResource,
            TracksResource: TracksResource,
            playlistData: _playlistData,
            currentTrack: _currentTrack
        });
    }));

    it("should add selected song to playlist", function() {
        $scope.search("foo");
        expect(Spotify.search).toHaveBeenCalledWith("foo", "track", { limit: 20 });
    });

    it("should attach resolved data to scope", function() {
        expect($scope.playlist).toEqual(_playlistData);
        expect($scope.current).toEqual(_currentTrack.track);
    });

    it("should add current track to playlist on init", function() {
        expect($scope.playlist[0]).toEqual(_currentTrack.track);
        expect($scope.playlist.length).toEqual(3);
    });

    it("should search for spotify track", function() {
        var track = { uri: "foo" };
        $scope.onTrackSelected(track);
        expect(PlayerQueueResource.save).toHaveBeenCalledWith(track);
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
            _playlistData.unshift(_currentTrack.track);
            expect($scope.playlist).toEqual(_playlistData);
        });

        it("should update current", function(){
            expect($scope.current).toEqual(_currentTrack.track);
        });
    });

    describe("socket event handling", function(){

        it("should update playlist on end event", function() {
            var eventData = { uri: _currentTrack.track.spotify_uri },
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
            var eventData = { uri: _playlistData[0].spotify_uri };

            $scope.$broadcast("fm:player:play", eventData);

            expect($scope.paused).toEqual(false);
            expect($scope.current).toEqual($scope.playlist[0]);
            expect($scope.current.spotify_uri).toEqual(eventData.uri);
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
            var eventData = { uri: "spotify:track:3OYPskZPKnOcHZ9fUDwmCK" };

            $scope.$broadcast("fm:player:add", eventData);
            expect($scope.playlist.length).toEqual(4);
            expect($scope.playlist[3]).toEqual(_currentTrack.track);
        });

    });

});
