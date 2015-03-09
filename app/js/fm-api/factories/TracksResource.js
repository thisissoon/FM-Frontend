"use strict";
/**
 * Factory which provides methods to perform on thisisoon FM API
 * /player/tracks endpoint. Gets specific track data.
 * @class PlayerPlaylistResource
 */
angular.module("sn.fm.api").factory("TracksResource", [
    "$resource",
    "SERVER_ADDRESS",
    /**
     * @constructor
     * @param {Service} $resource
     * @param {String}  SERVER_ADDRESS
     */
    function ($resource, SERVER_ADDRESS) {

        return $resource(
            SERVER_ADDRESS + "tracks" + "/:id",
            // Default values for url parameters.
            {
                id: "@id"
            }
        );

    }
]);
