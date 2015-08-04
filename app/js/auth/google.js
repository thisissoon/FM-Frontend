"use strict";
/**
 * Handles authentication using OAuth
 * @module   FM.auth.google
 * @author   SOON_
 * @requires config
 * @requires satellizer
 */
angular.module("FM.auth.google", [
    "FM.auth.LoginGoogleCtrl",
    "FM.auth.GoogleAuthService",
    "config",
    "satellizer"
])
/**
 * @method config
 * @param {Service} $authProvider
 * @param {Object}  env
 */
.config([
    "$authProvider",
    "env",
    function ($authProvider, env) {

        $authProvider.httpInterceptor = false;
        $authProvider.tokenName = "access_token";
        $authProvider.tokenPrefix = "sn_fm";
        $authProvider.authHeader = "Access-Token";
        $authProvider.google({
            url: env.FM_API_SERVER_ADDRESS + "oauth2/google/connect",
            clientId: env.GOOGLE_CLIENT_ID,
            redirectUri: env.GOOGLE_REDIRECT_URI,
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
    "GoogleAuthService",
    function ($rootScope, $auth, GoogleAuthService){

        /**
         * Set isAuthenticatedGoogle if token exists
         * @returns {Boolean} user is authenticated
         */
        $rootScope.isAuthenticatedGoogle = function isAuthenticatedGoogle() {
            return Boolean($auth.getToken());
        };

        if ($rootScope.isAuthenticatedGoogle()){
            GoogleAuthService.loadUser();
        }

    }
]);
