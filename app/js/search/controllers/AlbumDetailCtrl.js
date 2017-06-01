"use strict";
/**
 * @module   FM.search.AlbumDetailCtrl
 * @author   SOON_
 * @requires spotify
 * @requires ngRoute
 */
angular.module("FM.search.AlbumDetailCtrl", [
    "ngRoute",
    "config",
    "FM.api.PlayerSpotifyAlbumResource",
    "FM.player.trackDirective"
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
            .when("/albums/:id", {
                templateUrl: "partials/albums-detail.html",
                controller: "AlbumDetailCtrl",
                resolve: {
                    album: ["PlayerSpotifyAlbumResource", "$route", function (PlayerSpotifyAlbumResource, $route){
                        return PlayerSpotifyAlbumResource.get({id: $route.current.params.id}).$promise;
                    }],
                    albumTracks: ["PlayerSpotifyAlbumResource", "$route", function (PlayerSpotifyAlbumResource, $route){
                        return PlayerSpotifyAlbumResource.getTracks({
                            id: $route.current.params.id,
                            limit: env.SEARCH_LIMIT
                        }).$promise;
                    }]
                }
            });

    }
])
/**
 * @constructor
 * @class AlbumDetailCtrl
 * @param {Object} $scope
 * @param {Array}  Spotify
 * @param {Object} album
 * @param {Object} albumTracks
 */
.controller("AlbumDetailCtrl", [
    "$scope",
    "Spotify",
    "album",
    "albumTracks",
    "env",
    function ($scope, Spotify, album, albumTracks, env) {

        /**
         * Album data
         * @property album
         * @type {Object}
         */
        $scope.album = album;

        /**
         * List of artist albums
         * @property albumTracks
         * @type {Array}
         */
        $scope.albumTracks = albumTracks.items;

        /**
         * Albums track list meta data
         * @property meta
         * @type {Object}
         */
        $scope.meta = albumTracks;

        /**
         * @property loadDisabled
         * @type {Boolean}
         */
        $scope.loadDisabled = false;

        /**
         * Load more artist singles
         * @method loadMore
         */
        $scope.loadMore = function loadMore(){
            $scope.loadDisabled = true;
            Spotify.getAlbumTracks($scope.album.id, {
                limit: env.SEARCH_LIMIT,
                offset: $scope.albumTracks.length
            }).then(function (response) {
                $scope.albumTracks = $scope.albumTracks.concat(response.items);
                $scope.meta = response;
                $scope.loadDisabled = false;
            });
        };

    }

]);
