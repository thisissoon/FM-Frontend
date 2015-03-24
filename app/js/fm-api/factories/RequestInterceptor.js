"use strict";
/**
 * @class RequestInterceptor
 */
angular.module("sn.fm.api").factory("RequestInterceptor", [
    "$q",
    "$location",
    "satellizer.config",
    "FM_API_SERVER_ADDRESS",
    /**
     * @constructor
     * @param {Service} $q
     * @param {Service} $location
     * @param {Object}  config                   satellizer configuration
     * @param {String}  FM_API_SERVER_ADDRESS    API server url
     */
    function ($q, $location, config, FM_API_SERVER_ADDRESS) {

        return {

            /**
             * Intercepts FM API requests to add auth header
             * @param   {Object}   httpConfig
             * @returns {Object} modified httpConfig
             */
            request: function(httpConfig) {

                var tokenName = config.tokenPrefix ? config.tokenPrefix + "_" + config.tokenName : config.tokenName;

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
                console.log(response.status);

                if (response.status === 401){
                    $location.path("/401");
                } else if (response.status < 200 || response.status > 299){
                    $location.path("/500");
                }
            }
        };


    }
]);
