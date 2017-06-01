"use strict";
/**
 * Factory which provides methods to perform on thisisoon FM API
 * /player/spotify/search endpoint
 * @module FM.api.PlayerSpotifySearchResource
 * @author SOON_
 */
angular.module("FM.api.PlayerSpotifySearchResource", [
    "config",
    "FM.api.PaginationInterceptor",
    "ngResource"
])
/**
 * @constructor
 * @class PlayerSpotifySearchResource
 * @param {Service} $resource
 * @param {Object}  env
 */
.factory("PlayerSpotifySearchResource", [
    "$resource",
    "env",
    function ($resource, env) {

        return $resource(
            env.FM_API_SERVER_ADDRESS + "spotify/search",
            {},
            {
                query: {
                    isArray: false
                }
            }
        );

    }
]);
