"use strict";
/**
 * Service for FM player provides playback
 * controls and current player data and state
 * @module FM.player.PlayerService
 * @author SOON_
 */
angular.module("FM.player.PlayerService",[
    "FM.api.PlayerTransportResource",
    "FM.api.PlayerMuteResource",
    "FM.api.PlayerVolumeResource"
])
/**
 * @class PlayerService
 * @param {Service} $q
 * @param {Service} $rootScope
 */
.service("PlayerService", [
    "$q",
    "$rootScope",
    "PlayerTransportResource",
    "PlayerMuteResource",
    "PlayerVolumeResource",
    function ($q, $rootScope, PlayerTransportResource, PlayerMuteResource, PlayerVolumeResource) {

        var _this = this;

        /**
         * The currently playing track
         * @public
         * @property track
         * @type     {Object}
         */
        this.track = {};

        /**
         * Tracks the state of mute
          * @public
         * @property mute
         * @type     {Boolean}
         */
        this.mute = false;

        /**
         * @public
         * @property volume
         * @type     {Integer}
         */
        this.volume = 0;

        /**
         * @public
         * @property paused
         * @type     {Boolean}
         */
        this.paused = false;

        /**
         * Get all the data
         * @private
         * @method getAllData
         */
        var getAllData = function getAllData(){
            $q.all([
                PlayerTransportResource.get().$promise,
                PlayerMuteResource.get().$promise,
                PlayerVolumeResource.get().$promise
            ]).then(function (response){
                _this.track = response[0];
                _this.mute = response[1].mute;
                _this.volume = response[2].volume;
            });
        };

        /**
         * Start the service by getting all the data
         * @public
         * @method init
         */
        this.init = function init(){
            getAllData();
        };

        /**
         * Set paused state and send request to API
         * @public
         * @method resume
         */
        this.resume = function resume() {
            PlayerTransportResource.resume({}).$promise
                .then(onResume);
        };

        /**
         * Set paused state and send request to API
         * @public
         * @method pause
         */
        this.pause = function pause() {
            PlayerTransportResource.pause({}).$promise
                .then(onPause);
        };

        /**
         * Send DELETE request to API
         * @public
         * @method skip
         */
        this.skip = function skip() {
            PlayerTransportResource.skip().$promise
                .then(onEnd);
        };

        /**
         * send POST request to update volume
         * @public
         * @method updateVol
         * @param {Integer} vol Updated ew value of volume
         */
        this.updateVol = function updateVol(vol) {
            PlayerVolumeResource.save({ volume: parseInt(vol) });
        };

        /**
         * Toggle mute state and save
         * @public
         * @method toggleMute
         */
        this.toggleMute = function toggleMute() {
            if (_this.mute) {
                PlayerMuteResource.remove().$promise
                    .then(onUnmute);
            } else {
                PlayerMuteResource.save({ mute: true }).$promise
                    .then(onMute);
            }
        };

        /**
         * On end event, remove the current track
         * @private
         * @method onEnd
         */
        var onEnd = function onEnd() {
            _this.track = null;
        };

        /**
         * On pause event, update paused state
         * @private
         * @method onPause
         */
        var onPause = function onPause() {
            _this.paused = true;
        };

        /**
         * On resume event, update paused state
         * @private
         * @method onResume
         */
        var onResume = function onResume() {
            _this.paused = false;
        };

        /**
         * On setMute event, set mute status
         * @private
         * @method onSetMute
         */
        var onSetMute = function onSetMute(event, data) {
            _this.mute = data.mute;
        };

        /**
         * Set mute to true
         * @private
         * @method onMute
         */
        var onMute = function onMute() {
            _this.mute = true;
        };

        /**
         * Set mute to false
         * @private
         * @method onUnmute
         */
        var onUnmute = function onUnmute() {
            _this.mute = false;
        };

        /**
         * On setVolume event, set mute status
         * @private
         * @method onSetVolume
         */
        var onSetVolume = function onSetVolume(event, data) {
            _this.volume = data.volume;
        };


        $rootScope.$on("fm:player:play", getAllData);
        $rootScope.$on("fm:player:end", onEnd);
        $rootScope.$on("fm:player:pause", onPause);
        $rootScope.$on("fm:player:resume", onResume);
        $rootScope.$on("fm:player:setMute", onSetMute);
        $rootScope.$on("fm:player:setVolume", onSetVolume);

    }
]);
