"use strict";
/**
 * Controller for thisissoon FM player view, handles searching
 * the spotify api for songs using ngMaterial autocomplete and
 * angular-spotify
 * @class  PlayerCtrl
 * @module sn.fm.player
 * @author SOON_
 */
angular.module("sn.fm.player").controller("PlayerCtrl", [
    "$scope",
    "$q",
    "$mdToast",
    "$mdDialog",
    "PlayerQueueResource",
    "PlayerTransportResource",
    "TracksResource",
    "UsersResource",
    "PlayerMuteResource",
    "PlayerVolumeResource",
    "playlistData",
    "currentTrack",
    "muteState",
    /**
     * @constructor
     * @param {Object}  $scope
     * @param {Service} $q
     * @param {Service} $mdToast
     * @param {Service} $mdDialog
     * @param {Factory} PlayerQueueResource
     * @param {Factory} PlayerTranportResource
     * @param {Factory} TracksResource
     * @param {Factory} UsersResource
     * @param {Factory} PlayerMuteResource
     * @param {Factory} PlayerVolumeResource
     * @param {Array}   playlistData
     * @param {Object}  currentTrack
     * @param {Object}  muteState
     */
    function (
        $scope, $q, $mdToast, $mdDialog,
        PlayerQueueResource, PlayerTransportResource, TracksResource, UsersResource, PlayerMuteResource, PlayerVolumeResource,
        playlistData, currentTrack, muteState) {

        /**
         * An instance of the $resource PlayerQueueResource
         * which contains a list of the thisissoon FM queue
         * @property playlist
         * @type     {Object}
         */
        $scope.playlist = playlistData;

        /**
         * The currently playing track
         * @property current
         * @type     {Object}
         */
        $scope.current = currentTrack;

        /**
         * Tracks the state of playback
         * @property paused
         * @type     {Boolean}
         */
        $scope.paused = currentTrack.paused;

        /**
         * Tracks the state of mute
         * @property mute
         * @type     {Boolean}
         */
        $scope.mute = muteState.mute;

        /**
         * Set paused state and send request to API
         * @method resume
         */
        $scope.resume = function resume() {
            $scope.paused = false;
            PlayerTransportResource.resume();
        };

        /**
         * Set paused state and send request to API
         * @method pause
         */
        $scope.pause = function pause() {
            $scope.paused = true;
            PlayerTransportResource.pause({});
        };

        /**
         * Send DELETE request to API
         * @method skip
         */
        $scope.skip = function skip() {
            PlayerTransportResource.skip();
        };

        /**
         * Value to increment/decrement volume by
         * @property volumeStep
         * @type     {Number}
         */
        $scope.volumeStep = 5;

        /**
         * Increment volume
         * @method volumeUp
         */
        $scope.volumeUp = function volumeUp() {
            PlayerVolumeResource.get({}, function(volume){

                // round volume
                volume.volume = Math.round(volume.volume / $scope.volumeStep) * $scope.volumeStep;
                volume.volume = volume.volume + $scope.volumeStep;

                if (volume.volume > 100) {
                    volume.volume = 100;
                }

                volume.$save();

            });
        };

        /**
         * Decrement volume
         * @method volumeDown
         */
        $scope.volumeDown = function volumeDown() {
            PlayerVolumeResource.get({}, function(volume){

                // round volume
                volume.volume = Math.round(volume.volume / $scope.volumeStep) * $scope.volumeStep;
                volume.volume = volume.volume - $scope.volumeStep;

                if (volume.volume < 0) {
                    volume.volume = 0;
                }

                volume.$save();
            });
        };

        /**
         * Toggle mute state and save
         * @method toggleMute
         */
        $scope.toggleMute = function toggleMute() {
            if ($scope.mute) {
                $scope.mute = false;
                PlayerMuteResource.delete();
            } else {
                $scope.mute = true;

                PlayerMuteResource.save({ mute: true }).$promise
                    .then(function(response){
                        // Check if mute was successfully set, if not revert mute state
                        if (!response.message.match("201")) {
                            $scope.mute = false;
                        }

                        // Handle unauthorised error in-view
                        if (response.message.match("401")) {
                            $scope.showAlert("Unauthorised", "You need to be logged in to do that.");
                        }
                    })
                    .catch(function(error){
                        $scope.mute = false;
                        $scope.showAlert("Error", error.message);
                    });
            }
        };

        /**
         * Show alert dialog with mdDialog service
         * @param {String} title   title to display in dialog
         * @param {String} content content to display in dialog
         */
        $scope.showAlert = function showAlert(title, content) {
            $mdDialog.show(
                $mdDialog.alert()
                    .title(title)
                    .content(content)
                    .ariaLabel("Alert")
                    .ok("Ok")
            );
        };

        /**
         * Update `playlist` and `current` with queue data and currently playing track from the API
         * @method refreshPlaylist
         */
        $scope.refreshPlaylist = function refreshPlaylistQueue(){
            $q.all([
                PlayerQueueResource.query().$promise,
                PlayerTransportResource.get().$promise
            ]).then(function(response){
                $scope.playlist = response[0];
                $scope.current = response[1];
                $scope.init();
            });
        };

        /**
         * Add currently playing track to playlist
         * @method init
         */
        $scope.init = function init() {
            if ($scope.current.track && $scope.current.track.id){
                $scope.playlist.unshift($scope.current);
            }
        };

        /**
         * On play event, set playback state variables
         * refresh playlist if song URI doesn't match the playlist
         * @method onPlay
         */
        $scope.onPlay = function onPlay(event, data) {
            if ($scope.playlist[0].track.uri === data.uri) { // jshint ignore:line
                $scope.paused = false;
                $scope.current = $scope.playlist[0];
            } else {
                $scope.refreshPlaylist();
                $scope.paused = false;
            }
        };

        /**
         * On end event, remove track from playlist
         * refresh playlist if song URI doesn't match the playlist
         * @method onEnd
         */
        $scope.onEnd = function onEnd(event, data) {
            if ($scope.playlist[0].track.uri === data.uri) { // jshint ignore:line
                $scope.playlist.splice(0, 1);
            } else {
                $scope.refreshPlaylist();
            }
        };

        /**
         * On pause event, update paused state
         * @method onPause
         */
        $scope.onPause = function onPause() {
            $scope.paused = true;
        };

        /**
         * On resume event, update paused state
         * @method onResume
         */
        $scope.onResume = function onResume() {
            $scope.paused = false;
        };

        /**
         * On add event, get track data and push to playlist
         * @method onAdd
         */
        $scope.onAdd = function onAdd(event, data) {
            $q.all([
                TracksResource.get({ id: data.uri }).$promise,
                UsersResource.get({ id: data.user }).$promise
            ]).then(function(response){
                var item = {
                    track: response[0],
                    user: response[1]
                };
                $scope.playlist.push(item);

                $mdToast.show(
                    $mdToast.simple()
                        .content(item.user.display_name + " added " + item.track.name + " to the playlist") // jshint ignore:line
                        .position("bottom right")
                        .hideDelay(5000)
                    );
            });
        };

        /**
         * On setMute event, set mute status
         * @method onSetMute
         */
        $scope.onSetMute = function onSetMute(event, data) {
            $scope.mute = data.mute;
        };

        /**
         * @listens fm:player:play
         */
        $scope.$on("fm:player:play", $scope.onPlay);

        /**
         * @listens fm:player:end
         */
        $scope.$on("fm:player:end", $scope.onEnd);

        /**
         * @listens fm:player:pause
         */
        $scope.$on("fm:player:pause", $scope.onPause);

        /**
         * @listens fm:player:resume
         */
        $scope.$on("fm:player:resume", $scope.onResume);

        /**
         * @listens fm:player:pause
         */
        $scope.$on("fm:player:add", $scope.onAdd);

        /**
         * @listens fm:player:setMute
         */
        $scope.$on("fm:player:setMute", $scope.onSetMute);

        $scope.init();

    }

]);
