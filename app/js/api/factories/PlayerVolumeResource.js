"use strict";
/**
 * Factory which provides methods to perform on thisisoon FM API
 * /player/volume endpoint
 * @module FM.api.PlayerVolumeResource
 * @author SOON_
 */
angular.module("FM.api.PlayerVolumeResource", [
    "ENV",
    "ngResource"
])
/**
 * @constructor
 * @class PlayerVolumeResource
 * @param {Service} $resource
 * @param {String}  FM_API_SERVER_ADDRESS
 */
.factory("PlayerVolumeResource", [
    "$resource",
    "FM_API_SERVER_ADDRESS",
    function ($resource, FM_API_SERVER_ADDRESS) {

        return $resource(FM_API_SERVER_ADDRESS + "player/volume");

    }
]);
