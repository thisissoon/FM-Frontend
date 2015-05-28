"use strict";
/**
 * Handles authentication using OAuth
 * @module   FM.auth
 * @author   SOON_
 * @requires ENV
 * @requires satellizer
 */
angular.module("FM.auth", [
    "FM.auth.LoginCtrl",
    "ENV",
    "satellizer"
])
/**
 * @method config
 * @param {Service} $authProvider
 * @param {String}  FM_API_SERVER_ADDRESS
 * @param {String}  GOOGLE_CLIENT_ID
 * @param {String}  GOOGLE_REDIRECT_URI
 */
.config([
    "$authProvider",
    "FM_API_SERVER_ADDRESS",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_REDIRECT_URI",
    function ($authProvider, FM_API_SERVER_ADDRESS, GOOGLE_CLIENT_ID, GOOGLE_REDIRECT_URI) {

        $authProvider.httpInterceptor = false;
        $authProvider.tokenName = "access_token";
        $authProvider.tokenPrefix = "sn_fm";
        $authProvider.authHeader = "Access-Token";
        $authProvider.google({
            url: FM_API_SERVER_ADDRESS + "oauth2/google/connect",
            clientId: GOOGLE_CLIENT_ID,
            redirectUri: GOOGLE_REDIRECT_URI,
            scope: "https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/plus.me https://www.googleapis.com/auth/plus.profiles.read email"
        });

    }
])
/**
 * @method run
 * @param  {Service} $rootScope
 * @param  {Service} $auth
 */
.run([
    "$rootScope",
    "$auth",
    function ($rootScope, $auth){

        /**
         * Set isAuthenticated if token exists
         * @returns {Boolean} user is authenticated
         */
        $rootScope.isAuthenticated = function isAuthenticated() {
            return Boolean($auth.getToken());
        };

    }
]);
