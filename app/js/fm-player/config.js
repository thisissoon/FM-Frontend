"use strict";
/**
 * Configuration for fm.player
 * @module sn.fm.player
 * @author SOON_
 */
angular.module("sn.fm.player").config([
    "$routeProvider",
    "$locationProvider",
    /**
     * @constructor
     * @param {Service} $routeProvider
     * @param {Service} $locationProvider
     */
    function ($routeProvider, $locationProvider) {

        $locationProvider.html5Mode(true).hashPrefix = "!";

        $routeProvider
            .when("/", {
                templateUrl: "partials/player.html",
                controller: "PlayerCtrl"
            })
            .otherwise({
                redirectTo: "/"
            });

    }
]);
