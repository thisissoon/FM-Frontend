"use strict";
/**
 * Configure angular services to the requirements
 * of sn.fm.api angular module such as $httpProvider
 * @module sn.fm.api
 * @author SOON_
 */
angular.module("sn.fm.api").config([
    "$httpProvider",
    "$authProvider",
    "FM_API_SERVER_ADDRESS",
    "BASE_URL",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_REDIRECT_URI",
    /**
     * @constructor
     * @param {Service}  $httpProvider
     * @param {Service}  $authProvider
     * @param {String}   FM_API_SERVER_ADDRESS
     * @param {String}   BASE_URL
     * @param {String}   GOOGLE_CLIENT_ID
     * @param {String}   GOOGLE_REDIRECT_URI
     */
    function ($httpProvider, $authProvider, FM_API_SERVER_ADDRESS, BASE_URL, GOOGLE_CLIENT_ID, GOOGLE_REDIRECT_URI) {

        $httpProvider.defaults.headers.common["Content-Type"] = "application/json; charset=utf-8";
        $httpProvider.interceptors.push("RequestInterceptor");

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
]);
