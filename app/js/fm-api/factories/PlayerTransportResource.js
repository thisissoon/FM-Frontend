"use strict";
/**
 * Factory which provides actions to perform on player transport endpoints
 */
angular.module("sn.fm.api").factory("PlayerTransportResource", [
    "$resource",
    "SERVER_ADDRESS",
    /**
     * @constructor
     * @param   {Service}  $resource angular resource service xhr wrapper for REST api's
     * @param   {String}   SERVER_ADDRESS    API address url
     */
    function ($resource, SERVER_ADDRESS) {

        return $resource(
            SERVER_ADDRESS + "player/",
            // Default values for url parameters.
            {},
            // Hash with declaration of custom action that should
            // extend the default set of resource actions
            {
                track: {
                    method: "GET",
                    url: SERVER_ADDRESS + "player/playing"
                },

                pause: {
                    method: "POST",
                    url: SERVER_ADDRESS + "player/pause"
                },

                resume: {
                    method: "DELETE",
                    url: SERVER_ADDRESS + "player/pause"
                }
            }

        );

    }
]);
