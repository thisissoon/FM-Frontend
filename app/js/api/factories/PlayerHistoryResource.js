"use strict";
/**
 * Factory which provides methods to perform on thisisoon FM API
 * /player/history endpoint
 * @module FM.api.PlayerHistoryResource
 * @author SOON_
 */
angular.module("FM.api.PlayerHistoryResource", [
    "config",
    "FM.api.PaginationInterceptor",
    "ngResource"
])
/**
 * @constructor
 * @class PlayerHistoryResource
 * @param {Service} $resource
 * @param {Object}  env
 */
.factory("PlayerHistoryResource", [
    "$resource",
    "env",
    function ($resource, env) {

        return $resource(
            env.FM_API_SERVER_ADDRESS + "player/history",
            {},
            {
                query: {
                    isArray: false
                }
            }
        );

    }
]);
