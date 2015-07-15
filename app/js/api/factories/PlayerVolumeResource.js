"use strict";
/**
 * Factory which provides methods to perform on thisisoon FM API
 * /player/volume endpoint
 * @module FM.api.PlayerVolumeResource
 * @author SOON_
 */
angular.module("FM.api.PlayerVolumeResource", [
    "config",
    "ngResource"
])
/**
 * @constructor
 * @class PlayerVolumeResource
 * @param {Service} $resource
 * @param {Object}  env
 */
.factory("PlayerVolumeResource", [
    "$resource",
    "env",
    function ($resource, env) {

        return $resource(env.FM_API_SERVER_ADDRESS + "player/volume");

    }
]);
