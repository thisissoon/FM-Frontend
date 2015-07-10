"use strict";
/**
 * @module   FM.search.PlaylistSearchCtrl
 * @author   SOON_
 * @requires spotify
 * @requires ngRoute
 */
angular.module("FM.search.PlaylistSearchCtrl", [
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
            .when("/playlists", {
                templateUrl: "partials/playlists-search.html",
                controller: "PlaylistSearchCtrl",
                resolve: {
                    search: ["Spotify", "$route", function (Spotify, $route){
                        return Spotify.search($route.current.params.query, "playlist", { limit: 20, market: "GB" });
                    }]
                }
            });

    }
])
/**
 * @constructor
 * @class PlaylistSearchCtrl
 * @param {Object}  $scope
 * @param {Service} $location
 * @param {Service} Spotify
 * @param {Array}   search
 */
.controller("PlaylistSearchCtrl", [
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
         * @property playlists
         * @type {Array}
         */
        $scope.playlists = search.playlists.items;

        /**
         * Search meta data
         * @property meta
         * @type {Object}
         */
        $scope.meta = search.playlists;

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
            Spotify.search($scope.search.query, "playlist", { limit: 20, offset: $scope.playlists.length, market: "GB" })
                .then(function (response) {
                    $scope.playlists = $scope.playlists.concat(response.playlists.items);
                    $scope.meta = response.playlists;
                    $scope.loadDisabled = false;
                });
        };

    }

]);
