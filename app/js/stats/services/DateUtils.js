"use strict";
/**
 * @module   FM.stats.DateUtils
 * @author   SOON_
 */
angular.module("FM.stats.DateUtils", [

])
/**
 * Dates in last week
 * @property {Array} LAST_WEEK
 */
.value("LAST_WEEK", [
    new Date(),
    new Date(new Date().setDate(new Date().getDate() - 1)),
    new Date(new Date().setDate(new Date().getDate() - 2)),
    new Date(new Date().setDate(new Date().getDate() - 3)),
    new Date(new Date().setDate(new Date().getDate() - 4)),
    new Date(new Date().setDate(new Date().getDate() - 5)),
    new Date(new Date().setDate(new Date().getDate() - 6))
])
/**
 * Date helper functions
 * @class DateUtils
 * @param   {Array}    LAST_WEEK
 * @returns {Object}
 */
.service("DateUtils", [
    "LAST_WEEK",
    function (LAST_WEEK) {

        /**
         * Return last occurence of a day in the week
         * @method lastOccurence
         * @param {Number} dayOfWeek  Day of the week to retreive (0-6)
         */
        this.lastOccurence = function lastOccurence (dayOfWeek) {
            for (var i = 0; i < LAST_WEEK.length; i++) {
                if (LAST_WEEK[i].getDay() === dayOfWeek) {
                    return LAST_WEEK[i];
                }
            }
        };

    }
]);
