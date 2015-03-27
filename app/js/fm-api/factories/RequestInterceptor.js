"use strict";
/**
 * @class RequestInterceptor
 */
angular.module("sn.fm.api").factory("RequestInterceptor", [
    "$rootScope",
    "$q",
    "$location",
    "satellizer.config",
    "FM_API_SERVER_ADDRESS",
    /**
     * @constructor
     * @param {Service} $rootScope
     * @param {Service} $q
     * @param {Service} $location
     * @param {Object}  config                satellizer configuration
     * @param {String}  FM_API_SERVER_ADDRESS API server url
     */
    function ($rootScope, $q, $location, config, FM_API_SERVER_ADDRESS) {

        var tokenName = config.tokenPrefix ? config.tokenPrefix + "_" + config.tokenName : config.tokenName;

        return {

            /**
             * Intercepts FM API requests to add auth header
             * @param   {Object}   httpConfig
             * @returns {Object} modified httpConfig
             */
            request: function(httpConfig) {

                if(httpConfig.url.match(FM_API_SERVER_ADDRESS)) {

                    var token = localStorage.getItem(tokenName);
                    if (token) {
                        httpConfig.headers[config.authHeader] = token;
                    }

                }

                return httpConfig;
            },

            /**
             * Intercepts all api requests to perform actions on the FE
             * if the api returns certain status codes e.g. navigate to
             * 500 page if server returns 500 code for any request.
             * @param {Object} response
             */
            responseError: function(response) {

                // Clear auth token if FM API returns "Unauthorised" status code
                if (response.config.url.match(FM_API_SERVER_ADDRESS) && response.status === 401) {
                    localStorage.removeItem(tokenName);
                }

                // Navigate to error pages if server returns error code whilst FE route is changing
                if($rootScope.routeChanging){
                    if (response.status === 401){
                        $location.path("/401");
                    } else if (response.status < 200 || response.status > 299){
                        $location.path("/500");
                    }
                }

                return response;

            }
        };


    }
]);
