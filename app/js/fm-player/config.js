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
                "50": "000000",
                "100": "000000",
                "200": "000000",
                "300": "000000",
                "400": "0c0c0c",
                "500": "191919",
                "600": "262626",
                "700": "323232",
                "800": "3f3f3f",
                "900": "4c4c4c",
                "A100": "5d5d5d",
                "A200": "6f6f6f",
                "A400": "818181",
                "A700": "939393",
                "contrastDefaultColor": "light",    // whether, by default, text (contrast)
                                                    // on this palette should be dark or light
                "contrastDarkColors": ["50", "100", //hues which contrast should be "dark" by default
                 "200", "300", "400", "A100"],
                "contrastLightColors": undefined    // could also specify this if default was 'dark'
             });

        $mdThemingProvider.theme("default")
            .primaryPalette("black");

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
