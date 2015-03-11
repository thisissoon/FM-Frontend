"use strict";
/**
 * Factory which provides methods to perform on thisisoon FM API
 * transport endpoint. Which controls the playback of the current song
 * @class PlayerTransportResource
 */
angular.module("sn.fm.api").factory("PlayerTransportResource", [
    "$resource",
    "ENV",
    /**
     * @constructor
     * @param {Service} $resource
     * @param {Object}  ENV
     */
    function ($resource, ENV) {

        return $resource(
            ENV.FM_API_SERVER_ADDRESS + "player/current",
            // Default values for url parameters.
            {},
            // Hash with declaration of custom action that should
            // extend the default set of resource actions
            {
                pause: {
                    method: "POST",
                    url: ENV.FM_API_SERVER_ADDRESS + "player/pause"
                },

                resume: {
                    method: "DELETE",
                    url: ENV.FM_API_SERVER_ADDRESS + "player/pause"
                }
            }

        );

    }
]);
