"use strict";
/**
 * Factory which provides actions to perform on player transport endpoints
 */
angular.module("sn.fm.api").factory("PlayerTransportResource", [
    "$resource",
    "ENV",
    /**
     * @constructor
     * @param   {Service}  $resource angular resource service xhr wrapper for REST api's
     * @param   {String}   ENV       environment variables object
     */
    function ($resource, ENV) {

        return $resource(
            ENV.API_ADDRESS + "player/",
            // Default values for url parameters.
            {

            },
            // Hash with declaration of custom action that should
            // extend the default set of resource actions
            {
                track: {
                    method: "GET",
                    url: ENV.API_ADDRESS + "player/playing"
                },

                pause: {
                    method: "POST",
                    url: ENV.API_ADDRESS + "player/pause"
                },

                resume: {
                    method: "DELETE",
                    url: ENV.API_ADDRESS + "player/pause"
                }
            }

        );

    }
]);
