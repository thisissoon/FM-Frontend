"use strict";
/**
 * Factory which provides methods to perform on thisisoon FM API
 * /player/random endpoint
 * @class PlayerRandomResource
 */
angular.module("sn.fm.api").factory("PlayerRandomResource", [
    "$resource",
    "FM_API_SERVER_ADDRESS",
    /**
     * @constructor
     * @param {Service} $resource
     * @param {String}  SERVER_ADDRESS
     */
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
