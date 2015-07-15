"use strict";
/**
 * Factory which provides methods to perform on thisisoon FM API
 * /player/mute endpoint
 * @module FM.api.PlayerMuteResource
 * @author SOON_
 */
angular.module("FM.api.PlayerMuteResource", [
    "config",
    "ngResource"
])
/**
 * @constructor
 * @class PlayerMuteResource
 * @param {Service} $resource
 * @param {Object}  env
 */
.factory("PlayerMuteResource", [
    "$resource",
    "env",
    function ($resource, env) {

        return $resource(env.FM_API_SERVER_ADDRESS + "player/mute");

    }
]);
