"use strict";
/**
 * An instance of a song for the FM.player.
 * Data format is the same as from the spotitfy api.
 * @module FM.player.trackDirective
 * @author SOON_
 */
angular.module("FM.player.trackDirective", [
    "FM.player.removeLeadingZeros",
    "FM.api.PlayerQueueResource",
    "ui.bootstrap.popover",
    "template/popover/popover-template.html",
    "template/popover/popover.html",
    "ui.bootstrap.dropdown"
])
/**
 * @example
    <fm-track spotify-track="mySpotifyTrackObject"></fm-track>
 * @constructor
 * @class fmTrack
 */
.directive("fmTrack",[
    "PlayerQueueResource",
    function (PlayerQueueResource){
        return {
            restrict: "EA",
            scope: {
                track: "=spotifyTrack",
                current: "=",
                user: "=",
                timer: "=?"
            },
            templateUrl: "partials/track.html",
            link: function($scope){

                /**
                 * @method onTrackUpdated
                 * @param  {Object} track
                 */
                $scope.onTrackUpdate = function onTrackUpdated(track){
                    if (track) {
                        $scope.track.allArtists = "";
                    }

                    if (track && track.artists){
                        angular.forEach(track.artists, function (artist, $index){
                            var s = ($index !== track.artists.length - 1) ? (artist.name + ", ") : artist.name;
                            $scope.track.allArtists += s;
                        });
                    }
                };

                /**
                 * @method addToPlaylist
                 * @param {Object} track
                 */
                $scope.addToPlaylist = function addToPlaylist (track) {
                    if (track && track.uri) {
                        PlayerQueueResource.save({ uri: track.uri });
                    }
                };

                $scope.$watch("track", $scope.onTrackUpdate, true);

            }
        };
    }
]);
