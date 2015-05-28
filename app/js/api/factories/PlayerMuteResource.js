"use strict";
/**
 * Factory which provides methods to perform on thisisoon FM API
 * /player/mute endpoint
 * @module FM.api.PlayerMuteResource
 * @author SOON_
 */
angular.module("FM.api.PlayerMuteResource", [
    "ENV",
    "ngResource"
])
/**
 * @constructor
 * @class PlayerMuteResource
 * @param {Service} $resource
 * @param {String}  FM_API_SERVER_ADDRESS
 */
.factory("PlayerMuteResource", [
    "$resource",
    "FM_API_SERVER_ADDRESS",
    function ($resource, FM_API_SERVER_ADDRESS) {

        return $resource(FM_API_SERVER_ADDRESS + "player/mute");

    }
]);
