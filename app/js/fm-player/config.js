"use strict";
/**
 * Configure angular services to the requirements
 * of sn.fm.player angular module e.g. Creates player
 * playlist routes.
 * @module sn.fm.player
 * @author SOON_
 */
angular.module("sn.fm.player").config([
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
            .when("/", {
                templateUrl: "partials/player.html",
                controller: "PlayerCtrl",
                resolve: {
                    playlistData: ["PlayerQueueResource", "$route", function (PlayerQueueResource, $route){
                        return PlayerQueueResource.query($route.current.params);
                    }],
                    currentTrack: ["PlayerTransportResource", function (PlayerTransportResource){
                        return PlayerTransportResource.get();
                    }],
                    PlayerMuteResource: ["PlayerMuteResource", function (PlayerMuteResource){
                        return PlayerMuteResource.get();
                    }]
                }
            })

            .when("/500", {
                templateUrl: "partials/500.html"
            })

            .otherwise({
                redirectTo: "/"
            });

    }
]);
