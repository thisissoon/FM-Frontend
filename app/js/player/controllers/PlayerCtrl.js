"use strict";
/**
 * Controller for thisissoon FM player view, handles searching
 * the spotify api for songs using ngMaterial autocomplete and
 * angular-spotify
 * @module FM.player.PlayerCtrl
 * @author SOON_
 */
angular.module("FM.player.PlayerCtrl",[
    "FM.api.PlayerTransportResource",
    "FM.api.PlayerMuteResource",
    "FM.api.PlayerVolumeResource",
    "FM.api.ERRORS"
])
/**
 * @class PlayerCtrl
 * @param {Object}  $scope
 * @param {Factory} PlayerTransportResource
 * @param {Factory} PlayerMuteResource
 * @param {Factory} PlayerVolumeResource
 * @param {Object}  ERRORS
 */
.controller("PlayerCtrl", [
    "$scope",
    "$q",
    "PlayerTransportResource",
    "PlayerMuteResource",
    "PlayerVolumeResource",
    "ERRORS",
    function ($scope, $q, PlayerTransportResource, PlayerMuteResource, PlayerVolumeResource) {

        /**
         * The currently playing track
         * @property track
         * @type     {Object}
         */
        $scope.track = {};

        /**
         * Tracks the state of mute
         * @property mute
         * @type     {Boolean}
         */
        $scope.mute = false;

        /**
         * @property volume
         * @type     {Integer}
         */
        $scope.volume = 0;

        /**
         * @property paused
         * @type     {Boolean}
         */
        $scope.paused = false;

        /**
         * Get all the data
         * @method getAllData
         */
        $scope.getAllData = function getAllData(){
            $q.all([
                PlayerTransportResource.get().$promise,
                PlayerMuteResource.get().$promise,
                PlayerVolumeResource.get().$promise
            ]).then(function (response){
                $scope.track = response[0];
                $scope.mute = response[1].mute;
                $scope.volume = response[2].volume;
            });
        };

        /**
         * Set paused state and send request to API
         * @method resume
         */
        $scope.resume = function resume() {
            PlayerTransportResource.resume().$promise
                .then($scope.onSuccess);
        };

        /**
         * Set paused state and send request to API
         * @method pause
         */
        $scope.pause = function pause() {
            PlayerTransportResource.pause().$promise
                .then($scope.onSuccess);
        };

        /**
         * Send DELETE request to API
         * @method skip
         */
        $scope.skip = function skip() {
            PlayerTransportResource.skip().$promise
                .then($scope.onSuccess);
        };

        /**
         * send POST request to update volume
         * @method skip
         */
        $scope.updateVol = function updateVol() {
            PlayerVolumeResource.save({ volume: $scope.volume }).$promise
                .then($scope.onSuccess);
        };

        /**
         * Toggle mute state and save
         * @method toggleMute
         */
        $scope.toggleMute = function toggleMute() {
            if ($scope.mute) {
                PlayerMuteResource.remove().$promise
                    .then($scope.onSuccess);
            } else {
                PlayerMuteResource.save({ mute: true }).$promise
                    .then($scope.onSuccess);
            }
        };

        /**
         * On end event, remove the current track
         * @method onEnd
         */
        $scope.onEnd = function onEnd() {
            $scope.track = null;
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
         * On setMute event, set mute status
         * @method onSetMute
         */
        $scope.onSetMute = function onSetMute(event, data) {
            $scope.mute = data.mute;
        };

        /**
         * On setVolume event, set mute status
         * @method onSetVolume
         */
        $scope.onSetVolume = function onSetVolume(event, data) {
            $scope.volume = data.volume;
        };

        /**
         * @method onSuccess
         * @param  {Object} response
         */
        $scope.onSuccess = function onSuccess(response){
            if (response && response.message && response.message.match && !response.message.match("200")) {
                $scope.getAllData();
            }
        };


        $scope.$on("fm:player:play", $scope.getAllData);
        $scope.$on("fm:player:end", $scope.onEnd);
        $scope.$on("fm:player:pause", $scope.onPause);
        $scope.$on("fm:player:resume", $scope.onResume);
        $scope.$on("fm:player:setMute", $scope.onSetMute);
        $scope.$on("fm:player:setVolume", $scope.onSetVolume);

        $scope.getAllData();
    }

]);
