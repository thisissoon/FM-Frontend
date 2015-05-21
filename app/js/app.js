"use strict";
/**
 * Searches for tracks using spotify and sends track uri data to
 * thisissoon FM API to add to the thisissoon FM player playlist
 * @module   FM
 * @main     FM
 * @author   SOON_
 */
angular.module("FM", [
    "FM.api",
    "FM.auth",
    "FM.playlist",
    "FM.player",
    "FM.search",
    "FM.sockets",
    "FM.loadingScreen"
])
/**
 * @method config
 * @param  {Provider} $routeProvider
 * @param  {Provider} $locationProvider
 * @param  {String}   HTML5_LOCATION
 */
.config([
    "$routeProvider",
    "$locationProvider",
    "HTML5_LOCATION",
    function ($routeProvider, $locationProvider, HTML5_LOCATION) {

        if (HTML5_LOCATION) {
            $locationProvider.html5Mode(true).hashPrefix = "!";
        }

        $routeProvider
            .when("/401", { templateUrl: "partials/401.html" })
            .when("/500", { templateUrl: "partials/500.html" })
            .otherwise({ redirectTo: "/" });

    }
]);
