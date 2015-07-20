"use strict";
/**
 * @module   FM.search.ArtistSearchCtrl
 * @author   SOON_
 * @requires spotify
 * @requires ngRoute
 */
angular.module("FM.search.ArtistSearchCtrl", [
    "spotify",
    "ngRoute",
    "config",
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
            .when("/artists", {
                templateUrl: "partials/artists-search.html",
                controller: "ArtistSearchCtrl",
                resolve: {
                    search: ["Spotify", "$route", function (Spotify, $route){
                        return Spotify.search($route.current.params.query, "artist", {
                            limit: env.SEARCH_LIMIT,
                            market: env.REGION_CODE
                        });
                    }]
                }
            });

    }
])
/**
 * @constructor
 * @class ArtistSearchCtrl
 * @param {Object}  $scope
 * @param {Service} $location
 * @param {Service} Spotify
 * @param {Array}   search
 */
.controller("ArtistSearchCtrl", [
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
         * @property artist
         * @type {Array}
         */
        $scope.artists = search.artists.items;

        /**
         * Search meta data
         * @property meta
         * @type {Object}
         */
        $scope.meta = search.artists;

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
            Spotify.search($scope.search.query, "artist", {
                limit: env.SEARCH_LIMIT,
                offset: $scope.artists.length,
                market: env.REGION_CODE
            }).then(function (response) {
                $scope.artists = $scope.artists.concat(response.artists.items);
                $scope.meta = response.artists;
                $scope.loadDisabled = false;
            });
        };

    }

]);
