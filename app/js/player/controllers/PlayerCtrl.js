"use strict";
/**
 * Controller for thisissoon FM player view, handles searching
 * the spotify api for songs using ngMaterial autocomplete and
 * angular-spotify
 * @module FM.player.PlayerCtrl
 * @author SOON_
 */
angular.module("FM.player.PlayerCtrl",[
    "sn.fm.api",
    "FM.player.ERRORS"
])
/**
 * @class PlayerCtrl
 * @param {Object}  $scope
 * @param {Srvice}  $q
 * @param {Factory} PlayerTransportResource
 * @param {Factory} UsersResource
 * @param {Factory} PlayerMuteResource
 * @param {Factory} PlayerVolumeResource
 * @param {Object}  ERRORS
 */
.controller("PlayerCtrl", [
    "$scope",
    "$q",
    "PlayerTransportResource",
    "UsersResource",
    "PlayerMuteResource",
    "PlayerVolumeResource",
    "ERRORS",
    /**
     * @constructor
     * @param {Object}  $scope
     * @param {Service} $q
     * @param {Factory} PlayerTranportResource
     * @param {Factory} UsersResource
     * @param {Factory} PlayerMuteResource
     * @param {Factory} PlayerVolumeResource
     * @param {Object}  ERRORS
     */
    function ($scope, $q, PlayerTransportResource, UsersResource, PlayerMuteResource, PlayerVolumeResource, ERRORS) {

        /**
         * The currently playing track
         * @property track
         * @type     {Object}
         */
        $scope.track = PlayerTransportResource.get();

        /**
         * Tracks the state of mute
         * @property mute
         * @type     {Boolean}
         */
        $scope.mute = PlayerMuteResource.get();

        /**
         * @property volume
         * @type     {Integer}
         */
        $scope.volume = PlayerVolumeResource.get();

        /**
         * Value to increment/decrement volume by
         * @property volumeStep
         * @type     {Number}
         */
        $scope.volumeStep = 5;

        /**
         * Set paused state and send request to API
         * @method resume
         */
        $scope.resume = function resume() {


            $scope.track.$resume().$promise
                .then(function (response){
                    // Check if resume was successfully set, if not revert local state
                    if (!response.message.match("200")) {
                        $scope.track.get();
                    }

                    // Handle unauthorised response status in-view
                    if (response.message.match("401")) {
                        $scope.showAlert(ERRORS.STATUS_401_TITLE, ERRORS.STATUS_401_MESSAGE);
                    }
                });
        };

        /**
         * Set paused state and send request to API
         * @method pause
         */
        $scope.pause = function pause() {
            $scope.paused = true;

            $scope.track.$pause().$promise
                .then(function (response){
                    // Check if pause was successfully set, if not revert local state
                    if (!response.message.match("200")) {
                        $scope.mute.get();
                    }

                    // Handle unauthorised response status in-view
                    if (response.message.match("401")) {
                        $scope.showAlert(ERRORS.STATUS_401_TITLE, ERRORS.STATUS_401_MESSAGE);
                    }
                });
        };

        /**
         * Send DELETE request to API
         * @method skip
         */
        $scope.skip = function skip() {
            $scope.track.$skip().$promise
                .then(function (response){
                    // Handle unauthorised response status in-view
                    if (response.message.match("401")) {
                        $scope.showAlert(ERRORS.STATUS_401_TITLE, ERRORS.STATUS_401_MESSAGE);
                    }
                });
        };

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
            if ($scope.mute.mute) {
                // un-mute
                $scope.mute = false;

                PlayerMuteResource.delete().$promise
                    .then(function(response){
                        // Check if mute was successfully set, if not revert mute state
                        if (!response.message.match("200")) {
                            $scope.mute = true;
                        }

                        // Handle unauthorised response status in-view
                        if (response.message.match("401")) {
                            $scope.showAlert(ERRORS.STATUS_401_TITLE, ERRORS.STATUS_401_MESSAGE);
                        }
                    });
            } else {
                // mute
                $scope.mute = true;

                PlayerMuteResource.save({ mute: true }).$promise
                    .then(function(response){
                        // Check if mute was successfully set, if not revert mute state
                        if (!response.message.match("201")) {
                            $scope.mute = false;
                        }

                        // Handle unauthorised response status in-view
                        if (response.message.match("401")) {
                            $scope.showAlert(ERRORS.STATUS_401_TITLE, ERRORS.STATUS_401_MESSAGE);
                        }
                    });
            }
        };

        /**
         * Show alert dialog with mdDialog service
         * @param {String} title   title to display in dialog
         * @param {String} content content to display in dialog
         */
        $scope.showAlert = function showAlert() {
            // $mdDialog.show(
            //     $mdDialog.alert()
            //         .title(title)
            //         .content(content)
            //         .ariaLabel("Alert")
            //         .ok("Ok")
            // );
        };

        /**
         * On end event, remove track from playlist
         * refresh playlist if song URI doesn't match the playlist
         * @method onEnd
         */
        $scope.onEnd = function onEnd() {
            $scope.track.get();
        };

        /**
         * On pause event, update paused state
         * @method onPause
         */
        $scope.onPause = function onPause() {
            $scope.track.get();
        };

        /**
         * On resume event, update paused state
         * @method onResume
         */
        $scope.onResume = function onResume() {
            $scope.track.get();
        };

        /**
         * On setMute event, set mute status
         * @method onSetMute
         */
        $scope.onSetMute = function onSetMute() {
            $scope.mute.get();
        };


        $scope.$on("fm:player:end", $scope.onEnd);
        $scope.$on("fm:player:pause", $scope.onPause);
        $scope.$on("fm:player:resume", $scope.onResume);
        $scope.$on("fm:player:setMute", $scope.onSetMute);

        console.log($scope);

    }

]);
