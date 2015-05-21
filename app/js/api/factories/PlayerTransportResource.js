"use strict";
/**
 * Factory which provides methods to perform on thisisoon FM API
 * transport endpoint. Which controls the playback of the current song
 * @module FM.api.PlayerTransportResource
 * @author SOON_
 */
angular.module("FM.api.PlayerTransportResource", [
    "ENV",
    "ngResource"
])
/**
 * @constructor
 * @class PlayerTransportResource
 * @param {Service} $resource
 * @param {String}  FM_API_SERVER_ADDRESS
 */
.factory("PlayerTransportResource", [
    "$resource",
    "FM_API_SERVER_ADDRESS",
    function ($resource, FM_API_SERVER_ADDRESS) {

        return $resource(
            FM_API_SERVER_ADDRESS + "player/current",
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
                    url: FM_API_SERVER_ADDRESS + "player/pause"
                },

                resume: {
                    method: "DELETE",
                    url: FM_API_SERVER_ADDRESS + "player/pause"
                }
            }

        );

    }
]);
