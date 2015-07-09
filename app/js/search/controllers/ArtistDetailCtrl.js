"use strict";
/**
 * @module   FM.search.ArtistDetailCtrl
 * @author   SOON_
 * @requires spotify
 * @requires ngRoute
 */
angular.module("FM.search.ArtistDetailCtrl", [
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
            .when("/artists/:id", {
                templateUrl: "partials/artists-detail.html",
                controller: "ArtistDetailCtrl",
                resolve: {
                    artist: ["Spotify", "$route", function (Spotify, $route){
                        return Spotify.getArtist($route.current.params.id);
                    }],
                    albums: ["Spotify", "$route", function (Spotify, $route){
                        return Spotify.getArtistAlbums($route.current.params.id, { limit: 20, album_type: "album,single" }); // jshint ignore:line
                    }],
                    topTracks: ["Spotify", "$route", function (Spotify, $route){
                        return Spotify.getArtistTopTracks($route.current.params.id, "GB");
                    }]
                }
            });

    }
])
/**
 * @constructor
 * @class ArtistDetailCtrl
 * @param {Object} $scope
 * @param {Array}  $location
 * @param {Array}  Spotify
 * @param {Array}  artist
 */
.controller("ArtistDetailCtrl", [
    "$scope",
    "$location",
    "Spotify",
    "artist",
    "albums",
    "topTracks",
    function ($scope, $location, Spotify, artist, albums, topTracks) {

        /**
         * Artist data
         * @property artist
         * @type {Object}
         */
        $scope.artist = artist;

        /**
         * List of artist albums
         * @property albums
         * @type {Array}
         */
        $scope.albums = albums.items;

        /**
         * Albums list meta data
         * @property meta
         * @type {Object}
         */
        $scope.meta = albums;

        /**
         * List of artist top tracks
         * @property topTracks
         * @type {Array}
         */
        $scope.topTracks = topTracks.tracks;

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
            Spotify.getArtistAlbums($scope.artist.id, { limit: 20, album_type: "album,single", offset: $scope.albums.length }) // jshint ignore:line
                .then(function (response) {
                    $scope.albums = $scope.albums.concat(response.items);
                    $scope.meta = response;
                    $scope.loadDisabled = false;
                });
        };

    }

]);
