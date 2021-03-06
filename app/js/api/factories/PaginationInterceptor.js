"use strict";
/**
 * @module FM.api.PaginationInterceptor
 * @author SOON_
 */
angular.module("FM.api.PaginationInterceptor", [

])
/**
 * @method config
 * @param  {Provider} $httpProvider
 */
.config([
    "$httpProvider",
    function ($httpProvider) {

        $httpProvider.interceptors.push("PaginationInterceptor");

    }
])
/**
 * @constructor
 * @class PaginationInterceptor
 */
.factory("PaginationInterceptor", [
    function () {

        return {
            /**
             * Adds pagination meta data to response body for paginated resources
             * @param   {Object} response $http response
             * @returns {Object} response with added metadata
             */
            response: function(response){

                var newResponse = response;
                if(response.data && angular.isArray(response.data)) {
                    newResponse.data = {
                        items: response.data,
                        meta: {
                            totalPages: parseInt(response.headers("Total-Pages")),
                            totalCount: parseInt(response.headers("Total-Count"))
                        }
                    };
                }
                return newResponse;
            }
        };

    }
]);
