"use strict";
/**
 * Searches for tracks using spotify and sends track uri data to
 * thisissoon FM API to add to the thisissoon FM player playlist
 * @module   FM
 * @main     FM
 * @author   SOON_
 */
angular.module("FM", [
    "FM.alert",
    "FM.api",
    "FM.auth",
    "FM.playlist",
    "FM.player",
    "FM.search",
    "FM.sockets",
    "FM.loadingScreen",
    "ngRoute",
    "ENV"
])
/**
 * @method config
 * @param  {Provider} $routeProvider
 * @param  {Provider} $locationProvider
 * @param  {Boolean}  HTML5_LOCATION
 */
.config([
    "$routeProvider",
    "$locationProvider",
    "HTML5_LOCATION",
    function ($routeProvider, $locationProvider, HTML5_LOCATION_ENABLED) {

        $locationProvider.html5Mode(HTML5_LOCATION_ENABLED).hashPrefix = "!";

        $routeProvider
            .when("/401", { templateUrl: "partials/401.html" })
            .when("/500", { templateUrl: "partials/500.html" })
            .otherwise({ redirectTo: "/" });

    }
]);
