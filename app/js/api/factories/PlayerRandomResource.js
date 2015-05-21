"use strict";
/**
 * Factory which provides methods to perform on thisisoon FM API
 * /player/random endpoint
 * @class  FM.api.PlayerRandomResource
 * @author SOON_
 */
angular.module("FM.api.PlayerRandomResource", [
    "ENV",
    "ngResource"
])
/**
 * @constructor
 * @class PlayerRandomResource
 * @param {Service} $resource
 * @param {String}  FM_API_SERVER_ADDRESS
 */
.factory("PlayerRandomResource", [
    "$resource",
    "FM_API_SERVER_ADDRESS",
    function ($resource, FM_API_SERVER_ADDRESS) {

        return $resource(
            FM_API_SERVER_ADDRESS + "player/random",
            {},
            {
                save: {
                    method: "POST",
                    isArray: true
                }
            }
        );

    }
]);
