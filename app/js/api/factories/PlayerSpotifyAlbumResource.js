"use strict";
/**
 * Factory which provides methods to perform on thisisoon FM API
 * /player/spotify/album endpoint
 * @module FM.api.PlayerSpotifyAlbumResource
 * @author SOON_
 */
angular.module("FM.api.PlayerSpotifyAlbumResource", [
    "config",
    "FM.api.PaginationInterceptor",
    "ngResource"
])
/**
 * @constructor
 * @class PlayerSpotifyAlbumResource
 * @param {Service} $resource
 * @param {Object}  env
 */
.factory("PlayerSpotifyAlbumResource", [
    "$resource",
    "env",
    function ($resource, env) {

        return $resource(
            env.FM_API_SERVER_ADDRESS + "spotify/albums/:id",
            {
                id: "@id"
            },
            {
                query: {
                    isArray: false
                },
                getTracks: {
                    method: "GET",
                    url: env.FM_API_SERVER_ADDRESS + "spotify/albums/:id/tracks",
                }
            }
        );

    }
]);
