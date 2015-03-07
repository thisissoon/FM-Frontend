"use strict";
/**
 * Controller for thisissoon FM player
 * @class  PlayerCtrl
 * @module sn.fm.player
 * @author SOON_
 */
angular.module("sn.fm.player").controller("PlayerCtrl", [
    "$scope",
    "$q",
    "Spotify",
    "PlayerPlaylistResource",
    /**
     * @constructor
     * @param {Object} $scope
     */
    function ($scope, $q, Spotify, PlayerPlaylistResource) {

        $scope.selectedItem = null;

        $scope.searchText = null;

        $scope.search = function search(query){
            var deferred = $q.defer();

            Spotify.search(query, "track", { limit: 20 }).then(function (response) {
                deferred.resolve(response.tracks.items);
            });

            return deferred.promise;
        };

        $scope.onTrackSelected = function onTrackSelected(track){
            PlayerPlaylistResource.save({ uri: track.uri });
        };

        $scope.playlist = [
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
            },
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
            },
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
        ];

    }

]);
