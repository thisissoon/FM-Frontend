"use strict";
/**
 * @module FM.api.RequestInterceptor
 * @author SOON_
 */
angular.module("FM.api.RequestInterceptor", [
    "FM.alert",
    "FM.api.ERRORS",
    "config",
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
 * @param {Object}  env
 */
.factory("RequestInterceptor", [
    "$rootScope",
    "$location",
    "$window",
    "satellizer.config",
    "env",
    "AlertService",
    "ERRORS",
    function ($rootScope, $location, $window, config, env, AlertService, ERRORS) {

        var tokenName = config.tokenPrefix ? config.tokenPrefix + "_" + config.tokenName : config.tokenName;

        return {

            /**
             * Intercepts FM API requests to add auth header
             * @method  request
             * @param   {Object} httpConfig
             * @returns {Object} modified httpConfig
             */
            request: function(httpConfig) {

                if (httpConfig.url.match(env.FM_API_SERVER_ADDRESS)) {

                    var token = $window.localStorage.getItem(tokenName);
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
                if (response.config.url.match(env.FM_API_SERVER_ADDRESS) && response.status === 401) {
                    $window.localStorage.removeItem(tokenName);
                }

                if($rootScope.routeChanging){

                    // Navigate to error pages if server returns error code whilst FE route is changing
                    if (response.status === 401){
                        $location.path("/401");
                    } else if (response.status < 200 || response.status > 299){
                        $location.path("/500");
                    }

                } else {

                    // Trigger alert if server returns error for in-view requests
                    switch(response.status) {
                        case 401:
                            AlertService.set(ERRORS.STATUS_401_MESSAGE, "warning");
                            break;
                        case 403:
                            AlertService.set(ERRORS.STATUS_403_MESSAGE, "danger");
                            break;
                        case 404:
                            AlertService.set(ERRORS.STATUS_404_MESSAGE, "info");
                            break;
                        default:
                            AlertService.set(response.statusText + ": " + response.data.message, "warning");
                            break;
                    }

                }

                return response;

            }
        };


    }
]);
