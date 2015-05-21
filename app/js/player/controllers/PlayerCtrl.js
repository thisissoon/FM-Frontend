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
    function ($scope, $q, PlayerTransportResource, PlayerMuteResource, PlayerVolumeResource, ERRORS) {

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
                PlayerMuteResource.save().$promise
                    .then($scope.onSuccess);
            }
        };

        $scope.onSuccess = function onSuccess(response){
            if (response && response.message && response.message.match && !response.message.match("200")) {
                $scope.getAllData();
            }
            // Handle unauthorised response status in-view
            if (response && response.message && response.message.match && response.message.match("401")) {
                $scope.showAlert(ERRORS.STATUS_401_TITLE, ERRORS.STATUS_401_MESSAGE);
            }
        };


        $scope.$on("fm:player:end", $scope.getAllData);
        $scope.$on("fm:player:pause", $scope.getAllData);
        $scope.$on("fm:player:resume", $scope.getAllData);
        $scope.$on("fm:player:setMute", $scope.getAllData);

        $scope.getAllData();
    }

]);
