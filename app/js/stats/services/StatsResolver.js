"use strict";
/**
 * @module   FM.stats.StatsResolver
 * @author   SOON_
 */
angular.module("FM.stats.StatsResolver", [
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
.factory("StatsResolver", [
    "$route",
    "$filter",
    "$location",
    "StatsResource",
    "DateUtils",
    function ($route, $filter, $location, StatsResource, DateUtils) {

        /**
         * New route parameters
         * @property {Object} params
         */
        var params = $route.current.params;

        /**
         * Is the param `to` greater than last Friday
         * @property {Boolean} toInvalid
         */
        var toInvalid = new Date(params.to) > DateUtils.lastOccurence(5);

        // Restrict `to` search param to last Friday
        if (!params.to || toInvalid) {
            params.to = $filter("date")(DateUtils.lastOccurence(5), "yyyy-MM-dd");
        }

        // Set `from` default to last week
        if (!params.from && !params.all) {
            var defaultFrom = new Date().setDate(DateUtils.lastOccurence(5).getDate() - 7);
            params.from = $filter("date")(defaultFrom, "yyyy-MM-dd");
        }

        $location.replace().search(params);
        return StatsResource.get(params).$promise;
    }
]);
