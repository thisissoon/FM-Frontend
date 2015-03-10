"use strict";
/**
 * Factory which provides methods to perform on thisisoon FM API
 * transport endpoint. Which controls the playback of the current song
 * @class PlayerTransportResource
 */
angular.module("sn.fm.api").factory("PlayerTransportResource", [
    "$resource",
    "SERVER_ADDRESS",
    /**
     * @constructor
     * @param {Service} $resource
     * @param {String}  SERVER_ADDRESS
     */
    function ($resource, SERVER_ADDRESS) {

        return $resource(
            SERVER_ADDRESS + "player/current",
            // Default values for url parameters.
            {},
            // Hash with declaration of custom action that should
            // extend the default set of resource actions
            {
                track: {
                    method: "GET"
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
