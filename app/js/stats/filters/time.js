"use strict";
/**
 * @module   FM.stats.timeFilter
 * @author   SOON_
 */
angular.module("FM.stats.timeFilter", [

])
/**
 * Split time in milliseconds into separate components;
 * minutes, hours, days
 */
.filter("time", [
    function(){
        return function(input){

            /**
             * Time split into its component
             * @property {Object} time
             */
            var time = {};

            /**
             * Time remaining
             * @property remainingTime
             */
            var remainingTime = input / 1000;

            time.seconds = Math.round(remainingTime % 60);

            remainingTime /= 60;
            time.minutes = Math.round(remainingTime % 60);

            remainingTime /= 60;
            time.hours = Math.round(remainingTime % 24);

            remainingTime /= 24;
            time.days = Math.round(remainingTime);

            var output = time.minutes + "m";

            if (time.hours || time.days) {
                output = time.hours + "h " + output;
            }
            if (time.days) {
                var descriptor = "day";
                if (time.days > 1) {
                    descriptor = descriptor + "s";
                }

                output = time.days + descriptor + " " + output;
            }

            return output;
        };
    }
]);
