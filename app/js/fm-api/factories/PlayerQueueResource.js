"use strict";
/**
 * Factory which provides methods to perform on thisisoon FM API
 * /player/queue endpoint
 * @class PlayerQueueResource
 */
angular.module("sn.fm.api").factory("PlayerQueueResource", [
    "$resource",
    "SERVER_ADDRESS",
    /**
     * @constructor
     * @param {Service} $resource
     * @param {String}  SERVER_ADDRESS
     */
    function ($resource, SERVER_ADDRESS) {

        return $resource(SERVER_ADDRESS + "player/queue");

    }
]);
