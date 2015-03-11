"use strict";
/**
 * Factory which provides methods to perform on thisisoon FM API
 * /player/queue endpoint
 * @class PlayerQueueResource
 */
angular.module("sn.fm.api").factory("PlayerQueueResource", [
    "$resource",
    "ENV",
    /**
     * @constructor
     * @param {Service} $resource
     * @param {Object}  ENV
     */
    function ($resource, ENV) {

        return $resource(ENV.FM_API_SERVER_ADDRESS + "player/queue");

    }
]);
