"use strict";
/**
 * @module   FM.stats.statsResolver
 * @author   SOON_
 */
angular.module("FM.stats.statsResolver", [
    "FM.stats.DateUtils",
    "FM.api.StatsResource",
    "ngRoute"
])
/**
 * Factory to resolve statistics data, with parameter restrictions
 * @param   {Object}   $route
 * @param   {Service}  $filter
 * @param   {String}   $location
 * @param   {Resource} StatsResource Resource to provide communication with API
 * @param   {Service}  DateUtils     Date helper utilities
 * @returns {Promise}  Data resolved from API
 */
.factory("statsResolver", [
    "$route",
    "$filter",
    "$location",
    "StatsResource",
    "DateUtils",
    function ($route, $filter, $location, StatsResource, DateUtils) {

        return function resolver(params){

            /**
             * The date last friday
             * @property {Date} lastFriday
             */
            var lastFriday = DateUtils.lastOccurence(5);

            /**
             * Is the param `to` greater than last Friday
             * @property {Boolean} toInvalid
             */
            var toInvalid = new Date(params.to) > lastFriday;

            /**
             * Is the param `from` greater than last Friday
             * @property {Boolean} fromInvalid
             */
            var fromInvalid = new Date(params.from) > lastFriday;

            // Restrict `to` search param to last Friday
            if (!params.to || toInvalid) {
                params.to = $filter("date")(lastFriday, "yyyy-MM-dd");
            }

            // Set `from` default to last week
            if ((!params.from && !params.all) || fromInvalid) {
                var defaultFrom = new Date(lastFriday - (7 * 86400000));
                params.from = $filter("date")(defaultFrom, "yyyy-MM-dd");
            }

            $location.replace().search(params);
            delete params.all;
            return StatsResource.get(params).$promise;
        };
    }
]);
