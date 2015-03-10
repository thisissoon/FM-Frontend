"use strict";

describe("sn.fm.player:PlayerCtrl", function() {

    var $scope, $q, Spotify, PlayerQueueResource, callback, _playlistData, _currentTrack;

    beforeEach(function (){
        module("sn.fm.player");
    });

    beforeEach(inject(function ($httpBackend) {
        $httpBackend.whenGET(/.*/).respond(200, []);
    }));

    beforeEach(inject(function ( $rootScope, $injector, $controller ) {
        $scope = $rootScope.$new();
        $q = $injector.get("$q");

        callback = function(){
            return {
                then: function(fn){
                    fn.apply(this,[{ tracks: { items: [] } }])
                }
            }
        }

        Spotify = {
            search: function(){}
        }
        spyOn(Spotify, "search").and.callFake(callback);

        PlayerQueueResource = $injector.get("PlayerQueueResource");
        spyOn(PlayerQueueResource, "save");

        _playlistData = [
            {
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
        ]

        _currentTrack = {
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

        $controller("PlayerCtrl", {
            $scope: $scope,
            $q: $q,
            Spotify: Spotify,
            PlayerQueueResource: PlayerQueueResource,
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
    });

    it("should search for spotify track", function() {
        var track = { uri: "foo" };
        $scope.onTrackSelected(track);
        expect(PlayerQueueResource.save).toHaveBeenCalledWith(track);
    });
});
