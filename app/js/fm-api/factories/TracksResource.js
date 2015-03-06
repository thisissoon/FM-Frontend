"use strict";
/**
 * Factory which provides actions to perform on /tracks endpoint
 */
angular.module("sn.fm.api").factory("TracksResource", [
    "$resource",
    "SERVER_ADDRESS",
    /**
     * @constructor
     * @param   {Service}  $resource angular resource service xhr wrapper for REST api's
     * @param   {String}   SERVER_ADDRESS    API address url
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
