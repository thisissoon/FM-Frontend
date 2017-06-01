"use strict";
/**
 * @module   FM.search.TrackSearchCtrl
 * @author   SOON_
 * @requires spotify
 * @requires ngRoute
 */
angular.module("FM.search.TrackSearchCtrl", [
    "FM.api.PlayerSpotifySearchResource",
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
                    search: ["PlayerSpotifySearchResource", "$route", function (PlayerSpotifySearchResource, $route){
                        return PlayerSpotifySearchResource.query({
                            q: $route.current.params.query + "*",
                            type: "track",
                            limit: env.SEARCH_LIMIT,
                            market: env.REGION_CODE
                        }).$promise;
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
    "PlayerSpotifySearchResource",
    "search",
    "env",
    function ($scope, $location, PlayerSpotifySearchResource, search, env) {

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
            PlayerSpotifySearchResource.query({
                q: $scope.search.query + "*",
                type: "track",
                limit: env.SEARCH_LIMIT,
                offset: $scope.tracks.length,
                market: env.REGION_CODE
            }).$promise.then(function (response) {
                $scope.tracks = $scope.tracks.concat(response.tracks.items);
                $scope.meta = response.tracks;
                $scope.loadDisabled = false;
            });
        };

    }

]);
