"use strict";
/**
 * Factory which provides methods to perform on thisisoon FM API
 * /player/queue endpoint
 * @module FM.api.PlayerQueueResource
 * @author SOON_
 */
angular.module("FM.api.PlayerQueueResource", [
    "config",
    "FM.api.PaginationInterceptor",
    "ngResource"
])
/**
 * @constructor
 * @class PlayerQueueResource
 * @param {Service} $resource
 * @param {Object}  env
 */
.factory("PlayerQueueResource", [
    "$resource",
    "env",
    function ($resource, env) {

        return $resource(
            env.FM_API_SERVER_ADDRESS + "player/queue",
            {},
            {
                query: {
                    isArray: false
                },
                remove: {
                    method: "DELETE",
                    url: env.FM_API_SERVER_ADDRESS + "player/queue/:id",
                },
                meta: {
                    method: "GET",
                    url: env.FM_API_SERVER_ADDRESS + "player/queue/meta"
                }
            }
        );

    }
]);
