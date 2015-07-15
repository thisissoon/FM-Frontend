"use strict";
/**
 * Factory which provides methods to perform on thisisoon FM API
 * /player/random endpoint
 * @class  FM.api.PlayerRandomResource
 * @author SOON_
 */
angular.module("FM.api.PlayerRandomResource", [
    "config",
    "ngResource"
])
/**
 * @constructor
 * @class PlayerRandomResource
 * @param {Service} $resource
 * @param {Object}  env
 */
.factory("PlayerRandomResource", [
    "$resource",
    "env",
    function ($resource, env) {

        return $resource(
            env.FM_API_SERVER_ADDRESS + "player/random",
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
