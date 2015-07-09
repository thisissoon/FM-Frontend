"use strict";
/**
 * @module   FM.search.AlbumDetailCtrl
 * @author   SOON_
 * @requires spotify
 * @requires ngRoute
 */
angular.module("FM.search.AlbumDetailCtrl", [
    "spotify",
    "ngRoute",
    "FM.player.trackDirective"
])
/**
 * @method config
 * @param  {Provider} $routeProvider
 */
.config([
    "$routeProvider",
    function ($routeProvider) {

        $routeProvider
            .when("/albums/:id", {
                templateUrl: "partials/albums-detail.html",
                controller: "AlbumDetailCtrl",
                resolve: {
                    album: ["Spotify", "$route", function (Spotify, $route){
                        return Spotify.getAlbum($route.current.params.id);
                    }],
                    albumTracks: ["Spotify", "$route", function (Spotify, $route){
                        return Spotify.getAlbumTracks($route.current.params.id, { limit: 20 });
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
    function ($scope, Spotify, album, albumTracks) {

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
            Spotify.getAlbumTracks($scope.album.id, { limit: 20, album_type: "single", offset: $scope.albumTracks.length }) // jshint ignore:line
                .then(function (response) {
                    $scope.albumTracks = $scope.albumTracks.concat(response.items);
                    $scope.meta = response;
                    $scope.loadDisabled = false;
                });
        };

    }

]);
