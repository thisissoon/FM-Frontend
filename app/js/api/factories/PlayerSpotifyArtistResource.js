"use strict";
/**
 * Factory which provides methods to perform on thisisoon FM API
 * /player/spotify/artist endpoint
 * @module FM.api.PlayerSpotifyArtistResource
 * @author SOON_
 */
angular.module("FM.api.PlayerSpotifyArtistResource", [
    "config",
    "FM.api.PaginationInterceptor",
    "ngResource"
])
/**
 * @constructor
 * @class PlayerSpotifyArtistResource
 * @param {Service} $resource
 * @param {Object}  env
 */
.factory("PlayerSpotifyArtistResource", [
    "$resource",
    "env",
    function ($resource, env) {

        return $resource(
            env.FM_API_SERVER_ADDRESS + "spotify/artists/:id",
            {
                id: "@id"
            },
            {
                query: {
                    isArray: false
                },
                getAlbums: {
                    method: "GET",
                    url: env.FM_API_SERVER_ADDRESS + "spotify/artists/:id/albums",
                },
                getTopTracks: {
                    method: "GET",
                    url: env.FM_API_SERVER_ADDRESS + "spotify/artists/:id/top-tracks",
                },
                getRelatedArtists: {
                    method: "GET",
                    url: env.FM_API_SERVER_ADDRESS + "spotify/artists/:id/related-artists",
                }
            }
        );

    }
]);
