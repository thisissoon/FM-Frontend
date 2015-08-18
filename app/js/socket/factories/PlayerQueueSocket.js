"use strict";
/**
 * Factory which provides methods for communicating with the FM FE API
 * /player/queue endpoint
 * @module FM.socket.sails.PlayerQueueSocket
 * @author SOON_
 */
angular.module("FM.socket.sails.PlayerQueueSocket", [

])
/**
 * @constructor
 * @class PlayerQueueSocket
 * @param {Service} $sailsSocket
 * @param {Object}  env
 */
.factory("PlayerQueueSocket", [
    "sailsResource",
    function (sailsResource) {

        return new sailsResource("/player/queue");

    }
]);
