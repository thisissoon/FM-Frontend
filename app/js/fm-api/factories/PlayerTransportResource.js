"use strict";
/**
 * Factory which provides methods to perform on thisisoon FM API
 * transport endpoint. Which controls the playback of the current song
 * @class PlayerTransportResource
 */
angular.module("sn.fm.api").factory("PlayerTransportResource", [
    "$resource",
    "FM_API_SERVER_ADDRESS",
    /**
     * @constructor
     * @param {Service} $resource
     * @param {String}  FM_API_SERVER_ADDRESS
     */
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
                    interceptor: {
                        response: function(response){

                            response.data = {
                                track: response.data,
                                status: response.status,
                                paused: response.headers("Paused")
                            };

                            response.resource.track = response.data;
                            response.resource.status = response.status;
                            response.resource.paused = response.headers("Paused");

                            return response;
                        }
                    }
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
