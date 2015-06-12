"use strict";
/**
 * Factory which provides methods to perform on thisisoon FM API
 * /player/history endpoint
 * @module FM.api.PlayerHistoryResource
 * @author SOON_
 */
angular.module("FM.api.PlayerHistoryResource", [
    "ENV",
    "FM.api.PaginationInterceptor",
    "ngResource"
])
/**
 * @constructor
 * @class PlayerHistoryResource
 * @param {Service} $resource
 * @param {String}  FM_API_SERVER_ADDRESS
 */
.factory("PlayerHistoryResource", [
    "$resource",
    "FM_API_SERVER_ADDRESS",
    function ($resource, FM_API_SERVER_ADDRESS) {

        return $resource(
            FM_API_SERVER_ADDRESS + "player/history",
            {},
            {
                query: {
                    isArray: false
                }
            }
        );

    }
]);
