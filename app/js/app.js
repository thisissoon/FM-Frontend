"use strict";
/**
 * Searches for tracks using spotify and sends track uri data to
 * thisissoon FM API to add to the thisissoon FM player playlist
 * @module   FM
 * @main     FM
 * @author   SOON_
 * @requires FM.playlist
 * @requires FM.player
 */
angular.module("FM", [
    "FM.playlist",
    "FM.player",
    "sn.fm.sockets",
    "sn.fm.loadingScreen"
])

.config([
    "$routeProvider",
    "$locationProvider",
    "HTML5_LOCATION",
    /**
     * @constructor
     * @param {Service} $routeProvider
     * @param {Service} $locationProvider
     * @param {Boolean} HTML5_LOCATION
     */
    function ($routeProvider, $locationProvider, HTML5_LOCATION) {

        if (HTML5_LOCATION) {
            $locationProvider.html5Mode(true).hashPrefix = "!";
        }

        $routeProvider
            .when("/500", {
                templateUrl: "partials/500.html"
            })
            .when("/401", {
                templateUrl: "partials/401.html"
            })
            .otherwise({
                redirectTo: "/"
            });

    }
]);
