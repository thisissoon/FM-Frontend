"use strict";
/**
 * Intercepts all api requests to perform actions on the FE
 * if the api returns certain status codes e.g. navigate to
 * 500 page if server returns 500 code for any request.
 * @class RequestInterceptor
 */
angular.module("sn.fm.api").factory("RequestInterceptor", [
    "$q",
    "$location",
    /**
     * @constructor
     * @param {Service} $q
     * @param {Service} $location
     */
    function ($q, $location) {

        return {

            responseError: function(response) {
                if (response.status < 200 || response.status > 299){
                    $location.path("/500");
                }
            }
        };


    }
]);
