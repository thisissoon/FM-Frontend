"use strict";
/**
 * @module FM.api.RequestInterceptor
 * @author SOON_
 */
angular.module("FM.api.RequestInterceptor", [
    "ENV",
    "satellizer",
    "ngRoute"
])
/**
 * @method config
 * @param  {Provider} $httpProvider
 */
.config([
    "$httpProvider",
    function ($httpProvider) {

        $httpProvider.interceptors.push("RequestInterceptor");

    }
])
/**
 * @method run
 * @param  {Service} $rootScope
 */
.run([
    "$rootScope",
    function ($rootScope){
        $rootScope.$on("$routeChangeStart", function(){
            $rootScope.routeChanging = true;
        });
        $rootScope.$on("$routeChangeSuccess", function(){
            $rootScope.routeChanging = false;
        });
        $rootScope.$on("$routeChangeError", function(){
            $rootScope.routeChanging = false;
        });
    }
])
/**
 * @constructor
 * @class RequestInterceptor
 * @param {Service} $rootScope
 * @param {Service} $location
 * @param {Object}  satellizer.config     satellizer configuration
 * @param {String}  FM_API_SERVER_ADDRESS API server url
 */
.factory("RequestInterceptor", [
    "$rootScope",
    "$location",
    "satellizer.config",
    "FM_API_SERVER_ADDRESS",
    function ($rootScope, $location, config, FM_API_SERVER_ADDRESS) {

        var tokenName = config.tokenPrefix ? config.tokenPrefix + "_" + config.tokenName : config.tokenName;

        return {

            /**
             * Intercepts FM API requests to add auth header
             * @method  request
             * @param   {Object} httpConfig
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
             * @method responseError
             * @param  {Object} response
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
