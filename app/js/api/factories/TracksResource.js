"use strict";
/**
 * Factory which provides methods to perform on thisisoon FM API
 * /player/tracks endpoint. Gets specific track data.
 * @module FM.api.TracksResource
 * @author SOON_
 */
angular.module("FM.api.TracksResource", [
    "ENV",
    "ngResource"
])
/**
 * @constructor
 * @class TracksResource
 * @param {Service} $resource
 * @param {String}  FM_API_SERVER_ADDRESS
 */
.factory("TracksResource", [
    "$resource",
    "FM_API_SERVER_ADDRESS",
    function ($resource, FM_API_SERVER_ADDRESS) {

        return $resource(
            FM_API_SERVER_ADDRESS + "tracks" + "/:id",
            // Default values for url parameters.
            {
                id: "@id"
            }
        );

    }
]);
