"use strict";
/**
 * Factory which provides methods to perform on thisisoon FM API
 * transport endpoint. Which controls the playback of the current song
 * @module FM.api.PlayerTransportResource
 * @author SOON_
 */
angular.module("FM.api.PlayerTransportResource", [
    "config",
    "ngResource"
])
/**
 * @constructor
 * @class PlayerTransportResource
 * @param {Service} $resource
 * @param {Object}  env
 */
.factory("PlayerTransportResource", [
    "$resource",
    "env",
    function ($resource, env) {

        return $resource(
            env.FM_API_SERVER_ADDRESS + "player/current",
            // Default values for url parameters.
            {},
            // Hash with declaration of custom action that should
            // extend the default set of resource actions
            {
                get: {
                    method: "GET",
                    transformResponse: function (data, headers){
                        var transformedResponse = angular.fromJson(data);
                        transformedResponse.paused = !!parseInt(headers("Paused"), 10);
                        return transformedResponse;
                    }
                },

                skip: {
                    method: "DELETE"
                },

                pause: {
                    method: "POST",
                    url: env.FM_API_SERVER_ADDRESS + "player/pause"
                },

                resume: {
                    method: "DELETE",
                    url: env.FM_API_SERVER_ADDRESS + "player/pause"
                }
            }

        );

    }
]);
