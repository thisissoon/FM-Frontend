"use strict";
/**
 * Factory which provides actions to perform on /tracks endpoint
 */
angular.module("sn.fm.api").factory("TracksResource", [
    "$resource",
    "ENV",
    /**
     * @constructor
     * @param   {Service}  $resource angular resource service xhr wrapper for REST api's
     * @param   {String}   ENV       environment variables object
     */
    function ($resource, ENV) {

        return $resource(
            ENV.API_ADDRESS + "tracks" + "/:id",
            // Default values for url parameters.
            {
                id: "@id"
            },
            // Hash with declaration of custom action that should
            // extend the default set of resource actions
            {

            }

        );

    }
]);
