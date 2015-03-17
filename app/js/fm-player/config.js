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
                controller: "PlayerCtrl",
                resolve: {
                    playlistData: ["PlayerQueueResource", "$route", function (PlayerQueueResource, $route){
                        return PlayerQueueResource.query($route.current.params).$promise;
                    }],
                    currentTrack: ["PlayerTransportResource", function (PlayerTransportResource){
                        return PlayerTransportResource.get().$promise;
                    }],
                    PlayerMuteResource: ["PlayerMuteResource", function (PlayerMuteResource){
                        return PlayerMuteResource.get().$promise;
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
