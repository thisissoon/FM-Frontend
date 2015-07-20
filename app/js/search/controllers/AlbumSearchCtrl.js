"use strict";
/**
 * @module   FM.search.AlbumSearchCtrl
 * @author   SOON_
 * @requires spotify
 * @requires ngRoute
 */
angular.module("FM.search.AlbumSearchCtrl", [
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
            .when("/albums", {
                templateUrl: "partials/albums-search.html",
                controller: "AlbumSearchCtrl",
                resolve: {
                    search: ["Spotify", "$route", function (Spotify, $route){
                        return Spotify.search($route.current.params.query, "album", {
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
 * @class AlbumSearchCtrl
 * @param {Object}  $scope
 * @param {Service} $location
 * @param {Service} Spotify
 * @param {Array}   search
 */
.controller("AlbumSearchCtrl", [
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
         * @property albums
         * @type {Array}
         */
        $scope.albums = search.albums.items;

        /**
         * Search meta data
         * @property meta
         * @type {Object}
         */
        $scope.meta = search.albums;

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
            Spotify.search($scope.search.query, "album", {
                limit: env.SEARCH_LIMIT,
                offset: $scope.albums.length,
                market: env.REGION_CODE
            }).then(function (response) {
                $scope.albums = $scope.albums.concat(response.albums.items);
                $scope.meta = response.albums;
                $scope.loadDisabled = false;
            });
        };

    }

]);
