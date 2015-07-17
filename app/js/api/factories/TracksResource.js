"use strict";
/**
 * Factory which provides methods to perform on thisisoon FM API
 * /player/tracks endpoint. Gets specific track data.
 * @module FM.api.TracksResource
 * @author SOON_
 */
angular.module("FM.api.TracksResource", [
    "config",
    "ngResource"
])
/**
 * @constructor
 * @class TracksResource
 * @param {Service} $resource
 * @param {String}  env
 */
.factory("TracksResource", [
    "$resource",
    "env",
    function ($resource, env) {

        return $resource(
            env.FM_API_SERVER_ADDRESS + "tracks" + "/:id",
            // Default values for url parameters.
            {
                id: "@id"
            }
        );

    }
]);
