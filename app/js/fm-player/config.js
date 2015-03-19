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
    "$mdThemingProvider",
    "HTML5_LOCATION",
    /**
     * @constructor
     * @param {Service} $routeProvider
     * @param {Service} $locationProvider
     * @param {Service} $mdThemingProvider
     * @param {Boolean} HTML5_LOCATION
     */
    function ($routeProvider, $locationProvider, $mdThemingProvider, HTML5_LOCATION) {

        if (HTML5_LOCATION) {
            $locationProvider.html5Mode(true).hashPrefix = "!";
        }

        $mdThemingProvider.definePalette("black", {
                "50": "d3d3d3",
                "100": "a8a8a8",
                "200": "7c7c7c",
                "300": "515151",
                "400": "262626",
                "500": "222222",
                "600": "1e1e1e",
                "700": "1a1a1a",
                "800": "161616",
                "900": "131313",
                "A100": "222222",
                "A200": "4e4e4e",
                "A400": "7a7a7a",
                "A700": "a6a6a6",
                "contrastDefaultColor": "light"
             });

        $mdThemingProvider.theme("default")
            .primaryPalette("black", {
                "default": "600",
                "hue-1": "100",
                "hue-2": "600",
                "hue-3": "A100"
            })
            .accentPalette("yellow");

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
                    muteState: ["PlayerMuteResource", function (PlayerMuteResource){
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
