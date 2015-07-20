"use strict";
/**
 * @module   FM.search.TrackSearchCtrl
 * @author   SOON_
 * @requires spotify
 * @requires ngRoute
 */
angular.module("FM.search.TrackSearchCtrl", [
    "spotify",
    "ngRoute",
    "config"
])
/**
 * @method config
 * @param  {Provider} $routeProvider
 */
.config([
    "$routeProvider",
    "env",
    function ($routeProvider, env) {

        $routeProvider
            .when("/tracks", {
                templateUrl: "partials/track-search.html",
                controller: "TrackSearchCtrl",
                resolve: {
                    search: ["Spotify", "$route", function (Spotify, $route){
                        return Spotify.search($route.current.params.query, "track", { limit: 20, market: env.REGION_CODE });
                    }]
                }
            });

    }
])
/**
 * @constructor
 * @class TrackSearchCtrl
 * @param {Object}  $scope
 * @param {Service} $location
 * @param {Service} Spotify
 * @param {Array}   search
 */
.controller("TrackSearchCtrl", [
    "$scope",
    "$location",
    "Spotify",
    "search",
    "env",
    function ($scope, $location, Spotify, search, env) {

        /**
         * Route search params
         * @property search
         * @type {Object}
         */
        $scope.search = $location.search();

        /**
         * Search results
         * @property tracks
         * @type {Array}
         */
        $scope.tracks = search.tracks.items;

        /**
         * Search meta data
         * @property meta
         * @type {Object}
         */
        $scope.meta = search.tracks;

        /**
         * @property loadDisabled
         * @type {Boolean}
         */
        $scope.loadDisabled = false;

        /**
         * Load more search results
         * @method loadMore
         */
        $scope.loadMore = function loadMore(){
            $scope.loadDisabled = true;
            Spotify.search($scope.search.query, "track", { limit: 20, offset: $scope.tracks.length, market: env.REGION_CODE })
                .then(function (response) {
                    $scope.tracks = $scope.tracks.concat(response.tracks.items);
                    $scope.meta = response.tracks;
                    $scope.loadDisabled = false;
                });
        };

    }

]);
