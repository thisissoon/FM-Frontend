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
    "FM.history",
    "FM.notifications",
    "FM.playlist",
    "FM.player",
    "FM.search",
    "FM.sockets",
    "FM.loadingScreen",
    "FM.nav",
    "FM.stats",
    "FM.users",
    "ngRoute",
    "notification",
    "config"
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
    "$notificationProvider",
    "env",
    function ($routeProvider, $locationProvider, $notificationProvider, env) {

        $locationProvider.html5Mode(env.HTML5_LOCATION).hashPrefix = "!";

        $routeProvider
            .when("/401", { templateUrl: "partials/401.html" })
            .when("/500", { templateUrl: "partials/500.html" })
            .otherwise({ redirectTo: "/" });

        $notificationProvider.setOptions({ delay: 5000 });

    }
]);
