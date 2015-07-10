"use strict";
/**
 * Factory which provides methods to perform on thisisoon FM API
 * /player/queue endpoint
 * @module FM.api.PlayerQueueResource
 * @author SOON_
 */
angular.module("FM.api.PlayerQueueResource", [
    "ENV",
    "FM.api.PaginationInterceptor",
    "ngResource"
])
/**
 * @constructor
 * @class PlayerQueueResource
 * @param {Service} $resource
 * @param {String}  FM_API_SERVER_ADDRESS
 */
.factory("PlayerQueueResource", [
    "$resource",
    "FM_API_SERVER_ADDRESS",
    function ($resource, FM_API_SERVER_ADDRESS) {

        return $resource(
            FM_API_SERVER_ADDRESS + "player/queue",
            {},
            {
                query: {
                    isArray: false
                },

                meta: {
                    method: "GET",
                    url: FM_API_SERVER_ADDRESS + "player/queue/meta"
                }
            }
        );

    }
]);
