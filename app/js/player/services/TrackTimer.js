"use strict";
/**
 * @module   FM.player.TrackTimer
 * @author   SOON_
 */
angular.module("FM.player.TrackTimer", [

])
/**
 * Timer service to track elapsed time of currently playing track
 * @example
 *  TrackTimer.start(duration, existingElapsedTime) // to start the timer
 *  TrackTimer.pause() // to pause the timer
 *  TrackTimer.reset() // to reset the timer to 0
 */
.service("TrackTimer", [
    "$interval",
    function ($interval) {

        var _this = this;

        /**
         * Time when latest timer was started in milliseconds
         * @property {Number} startTime
         * @private
         */
        var startTime = 0;

        /**
         * Time on the clock when last stopped in milliseconds
         * @property {Number} lastStopTime
         * @private
         */
        var lastStopTime = 0;

        /**
         * @method now
         * @returns {Number} Current time in milliseconds
         * @private
         */
        var now = function now () {
            return (new Date()).getTime();
        };

        /**
         * @method getTime
         * @returns {Number} total elapsed time
         * @private
         */
        var getTime = function getTime () {
            return lastStopTime + (now() - startTime);
        };

        /**
         * @property {Number} elapsedTime
         * @public
         */
        this.elapsedTime = 0;

        /**
         * @property {Number} elapsedTime
         * @public
         */
        this.percent = 0;

        /**
         * Start or resume timer
         * @param {Number} duration Duration of track to time
         * @param {Number} elapsed  Elapsed time on start (optional)
         * @method start
         * @public
         */
        this.start = function start (duration, elapsed) {

            // Default elapsed time on start to 0
            elapsed = elapsed ? elapsed : 0;

            // Set start time
            startTime = now() - elapsed;

            // Store timer as $interval instance
            _this.timerInstance = $interval(function(){
                // Stop timer when duration is exceeded
                if (_this.elapsedTime >= duration) {
                    _this.pause();
                    return;
                }

                // Set elapsed time and percentage completion
                _this.elapsedTime = getTime();
                _this.percent = (getTime() / duration) * 100;
            }, 1000);

        };

        /**
         * Pause timer and clear timer instance
         * @method pause
         * @public
         */
        this.pause = function pause () {
            // If timer is running, update elapsed time otherwise keep it
            lastStopTime = startTime ? lastStopTime + now() - startTime : lastStopTime;
            startTime = 0;

            // Clear timer instance
            if (_this.timerInstance){
                $interval.cancel(_this.timerInstance);
            }
        };

        /**
         * Reset timer
         * @method reset
         * @public
         */
        this.reset = function reset () {
            // Clear running timer
            if (startTime) {
                _this.pause();
            }

            // Reset timer to zero
            startTime = 0;
            lastStopTime = 0;
            _this.elapsedTime = 0;
            _this.percent = 0;
        };

    }
]);
