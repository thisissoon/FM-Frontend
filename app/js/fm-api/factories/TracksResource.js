"use strict";
/**
 * Factory which provides methods to perform on thisisoon FM API
 * /player/tracks endpoint. Gets specific track data.
 * @class PlayerPlaylistResource
 */
angular.module("sn.fm.api").factory("TracksResource", [
    "$resource",
    "ENV",
    /**
     * @constructor
     * @param {Service} $resource
     * @param {Object}  ENV
     */
    function ($resource, ENV) {

        return $resource(
            ENV.FM_API_SERVER_ADDRESS + "tracks" + "/:id",
            // Default values for url parameters.
            {
                id: "@id"
            }
        );

    }
]);
