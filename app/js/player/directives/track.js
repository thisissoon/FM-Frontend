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
    "FM.auth.GoogleAuthService",
    "ui.bootstrap.popover",
    "template/popover/popover-template.html",
    "template/popover/popover.html",
    "ui.bootstrap.dropdown",
    "config"
])
/**
 * @example
    <fm-track spotify-track="mySpotifyTrackObject"></fm-track>
 * @constructor
 * @class fmTrack
 */
.directive("fmTrack",[
    "PlayerQueueResource",
    "GoogleAuthService",
    "env",
    function (PlayerQueueResource, GoogleAuthService, env){
        return {
            restrict: "EA",
            scope: {
                track: "=spotifyTrack",
                id: "=?",
                current: "=",
                user: "=",
                timer: "=?",
                playCount: "=?"
            },
            templateUrl: "partials/track.html",
            link: function($scope){

                /**
                 * If the track is not available
                 * in the region set in the config
                 * @property regionLocked
                 * @type {Boolean}
                 */
                $scope.regionLocked = ($scope.track && $scope.track.available_markets) ? //jshint ignore:line
                                      ($scope.track.available_markets.indexOf(env.REGION_CODE) === -1) : //jshint ignore:line
                                      false;

                /**
                 * @property currentUser
                 * @type {Object}
                 */
                $scope.currentUser = GoogleAuthService.getUser();

                /**
                 * Whether the track has been added by the current user
                 * @property addedByCurrent
                 * @type {Boolean}
                 */
                $scope.addedByCurrent = ($scope.currentUser && $scope.user && $scope.currentUser.id && $scope.user.id ) ?
                                        ($scope.currentUser.id === $scope.user.id) :
                                        false;

                /**
                 * Remove track from queue
                 * @method removeTrack
                 * @param {String} uuid uuid of track in queue
                 */
                $scope.removeTrack = function removeTrack(uuid){
                    PlayerQueueResource.remove({ id: uuid });
                };

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
                        PlayerQueueResource.save({ uri: track.uri.replace("spotify:track:", "") });
                    }
                };

                $scope.$watch("track", $scope.onTrackUpdate, true);

            }
        };
    }
]);
