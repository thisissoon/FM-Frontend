"use strict";
/**
 * Factory which provides methods to perform on thisisoon FM API
 * /player/history endpoint
 * @module FM.api.PlayerHistoryResource
 * @author SOON_
 */
angular.module("FM.api.PlayerHistoryResource", [
    "ENV",
    "ngResource"
])
/**
 * @constructor
 * @class PlayerHistoryResource
 * @param {Service} $resource
 * @param {String}  FM_API_SERVER_ADDRESS
 */
.factory("PlayerHistoryResource", [
    "$resource",
    "FM_API_SERVER_ADDRESS",
    function ($resource, FM_API_SERVER_ADDRESS) {

        return $resource(
            FM_API_SERVER_ADDRESS + "player/history",
            // Default values for url parameters.
            {},
            // Hash with declaration of custom action that should
            // extend the default set of resource actions
            {
                query: {
                    method: "GET",
                    isArray: true,
                    transformResponse: function (data, headers){
                        var transformedResponse = angular.fromJson(data);
                        transformedResponse.totalPages = !!parseInt(headers("Total-Pages"));
                        return transformedResponse;
                    }
                }
            }
        );

    }
]);
