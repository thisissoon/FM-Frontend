"use strict";
/**
 * @module   FM.search.AlbumSearchCtrl
 * @author   SOON_
 * @requires spotify
 * @requires ngRoute
 */
angular.module("FM.search.AlbumSearchCtrl", [
    "spotify",
    "ngRoute"
])
/**
 * @method config
 * @param  {Provider} $routeProvider
 */
.config([
    "$routeProvider",
    function ($routeProvider) {

        $routeProvider
            .when("/albums", {
                templateUrl: "partials/albums-search.html",
                controller: "AlbumSearchCtrl",
                resolve: {
                    search: ["Spotify", "$route", function (Spotify, $route){
                        return Spotify.search($route.current.params.query, "album", { limit: 20, market: "GB" });
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
    function ($scope, $location, Spotify, search) {

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
            Spotify.search($scope.search.query, "album", { limit: 20, offset: $scope.albums.length, market: "GB" })
                .then(function (response) {
                    $scope.albums = $scope.albums.concat(response.albums.items);
                    $scope.meta = response.albums;
                    $scope.loadDisabled = false;
                });
        };

    }

]);
