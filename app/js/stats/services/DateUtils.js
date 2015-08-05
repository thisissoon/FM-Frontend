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
    new Date(new Date().getTime() - (86400000)),
    new Date(new Date().getTime() - (2*86400000)),
    new Date(new Date().getTime() - (3*86400000)),
    new Date(new Date().getTime() - (4*86400000)),
    new Date(new Date().getTime() - (5*86400000)),
    new Date(new Date().getTime() - (6*86400000)),
    new Date(new Date().getTime() - (7*86400000))
])
/**
 * Date helper functions
 * @class DateUtils
 * @param   {Array}    LAST_WEEK
 * @returns {Object}
 */
.service("DateUtils", [
    "$filter",
    "LAST_WEEK",
    function ($filter, LAST_WEEK) {

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

        /**
         * Return previous date periods from date range
         * E.g. given this week as a date range this will return last week, two weeks ago, three weeks ago etc
         * @method historicDatePeriods
         * @param {Date}   startDate
         * @param {Date}   endDate
         * @param {Number} numberOfPeriods
         */
        this.historicDatePeriods = function historicDatePeriods (startDate, endDate, numberOfPeriods) {

            startDate = new Date(startDate);
            endDate = endDate ? new Date(endDate) : new Date();

            /**
             * Difference in days between filter start and end dates
             * @property {Number} diff
             */
            var diff = (startDate.getTime() - endDate.getTime()) / (24 * 60 * 60 * 1000);

            /**
             * Calculated dates for historic data, based on filter dates
             * Eg. if the filter period is 1 week this will be 1 week before, 2 weeks before and 3 weeks before
             * @property {Array} dates
             */
            var dates = [];

            for (var i = 1; i <= numberOfPeriods; i++) {
                dates.push({
                    from: $filter("date")(new Date().setDate(startDate.getDate() + (diff * i)), "yyyy-MM-dd"),
                    to: $filter("date")(new Date().setDate(startDate.getDate() + (diff * (i - 1)) - 1), "yyyy-MM-dd"),
                });
            }

            return dates;

        };

    }
]);
