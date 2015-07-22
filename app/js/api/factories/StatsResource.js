"use strict";
/**
 * Factory which provides methods to perform on thisisoon FM API
 * /player/stats endpoint.
 * @module FM.api.StatsResource
 * @author SOON_
 */
angular.module("FM.api.StatsResource", [
    "config",
    "ngResource"
])
/**
 * @constructor
 * @class StatsResource
 * @param {Service} $resource
 * @param {String}  env
 */
.factory("StatsResource", [
    "$resource",
    "env",
    function ($resource, env) {

        return $resource(env.FM_API_SERVER_ADDRESS + "player/stats");

    }
]);
