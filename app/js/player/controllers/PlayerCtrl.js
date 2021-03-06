"use strict";
/**
 * Controller for thisissoon FM player
 * @module FM.player.PlayerCtrl
 * @author SOON_
 */
angular.module("FM.player.PlayerCtrl",[
    "FM.api.PlayerTransportResource",
    "FM.api.PlayerMuteResource",
    "FM.api.PlayerVolumeResource",
    "FM.player.TrackTimer",
    "ui.bootstrap.popover",
    "template/popover/popover-template.html",
    "template/popover/popover.html",
    "sn.title",
    "ngRoute"
])
/**
 * @method config
 */
.config([
    "$routeProvider",
    function ($routeProvider) {
        $routeProvider
            .when("/current", {
                templateUrl: "partials/player/current.html",
                controller: "PlayerCtrl"
            });
    }
])
/**
 * @class PlayerCtrl
 * @param {Object}  $scope
 * @param {Service} $q
 * @param {Factory} PlayerTransportResource
 * @param {Factory} PlayerMuteResource
 * @param {Factory} PlayerVolumeResource
 */
.controller("PlayerCtrl", [
    "$scope",
    "$q",
    "PlayerTransportResource",
    "PlayerMuteResource",
    "PlayerVolumeResource",
    "TrackTimer",
    "snTitle",
    function ($scope, $q, PlayerTransportResource, PlayerMuteResource, PlayerVolumeResource, TrackTimer, snTitle) {

        /**
         * The currently playing track
         * @property track
         * @type     {Object}
         */
        $scope.track = null;

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
         * @property trackPositionTimer
         * @type     {Object}
         */
        $scope.trackPositionTimer = TrackTimer;

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
                $scope.paused = response[0].paused;

                if ($scope.track && $scope.track.track) {

                    // Start track position timer
                    var elapsed = parseInt(response[0].player.elapsed_time) || 0; // jshint ignore:line
                    $scope.trackPositionTimer.start($scope.track.track.duration, elapsed);
                    if ($scope.paused) {
                        $scope.trackPositionTimer.pause();
                    }

                    snTitle.setPageTitle($scope.track.track.name + " - " + $scope.track.track.artists[0].name);

                }
            });
        };

        /**
         * Set paused state and send request to API
         * @method resume
         */
        $scope.resume = function resume() {
            PlayerTransportResource.resume({});
        };

        /**
         * Set paused state and send request to API
         * @method pause
         */
        $scope.pause = function pause() {
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
         * send POST request to update volume
         * @method skip
         */
        $scope.updateVol = function updateVol(vol) {
            $scope.volume = parseInt(vol, 10);
            PlayerVolumeResource.save({ volume: $scope.volume });
        };

        /**
         * Toggle mute state and save
         * @method toggleMute
         */
        $scope.toggleMute = function toggleMute() {
            if ($scope.mute) {
                PlayerMuteResource.remove();
            } else {
                PlayerMuteResource.save({ mute: true });
            }
        };

        /**
         * On end event, remove the current track
         * @method onEnd
         */
        $scope.onEnd = function onEnd() {
            $scope.trackPositionTimer.pause();
            $scope.trackPositionTimer.reset();
            $scope.track = null;

            snTitle.setPageTitle(null);
        };

        /**
         * On pause event, update paused state
         * @method onPause
         */
        $scope.onPause = function onPause() {
            $scope.trackPositionTimer.pause();
            $scope.paused = true;
        };

        /**
         * On resume event, update paused state
         * @method onResume
         */
        $scope.onResume = function onResume() {
            $scope.trackPositionTimer.start($scope.track.track.duration);
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
         * Set mute to true
         * @method onMute
         */
        $scope.onMute = function onMute() {
            $scope.mute = true;
        };

        /**
         * Set mute to false
         * @method onMute
         */
        $scope.onUnmute = function onUnmute() {
            $scope.mute = false;
        };

        /**
         * On setVolume event, set mute status
         * @method onSetVolume
         */
        $scope.onSetVolume = function onSetVolume(event, data) {
            $scope.volume = data.volume;
        };


        $scope.$on("fm:player:play", $scope.getAllData);
        $scope.$on("fm:player:end", $scope.onEnd);
        $scope.$on("fm:player:pause", $scope.onPause);
        $scope.$on("fm:player:resume", $scope.onResume);
        $scope.$on("fm:player:setMute", $scope.onSetMute);
        $scope.$on("fm:player:setVolume", $scope.onSetVolume);

        $scope.$on("$destroy", $scope.trackPositionTimer.pause);

        $scope.getAllData();

    }

]);
