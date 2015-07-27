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
    "config",
    "FM.player.trackDirective",
    "ui.bootstrap.tabs",
    "template/tabs/tab.html",
    "template/tabs/tabset.html"
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
            .when("/artists/:id", {
                templateUrl: "partials/artists-detail.html",
                controller: "ArtistDetailCtrl",
                resolve: {
                    artist: ["Spotify", "$route", function (Spotify, $route){
                        return Spotify.getArtist($route.current.params.id);
                    }],
                    albums: ["Spotify", "$route", function (Spotify, $route){
                        return Spotify.getArtistAlbums($route.current.params.id, {
                            limit: env.SEARCH_LIMIT,
                            album_type: "album", // jshint ignore:line
                            country: env.REGION_CODE
                        });
                    }],
                    singles: ["Spotify", "$route", function (Spotify, $route){
                        return Spotify.getArtistAlbums($route.current.params.id, {
                            limit: env.SEARCH_LIMIT,
                            album_type: "single", // jshint ignore:line
                            country: env.REGION_CODE
                        });
                    }],
                    topTracks: ["Spotify", "$route", function (Spotify, $route){
                        return Spotify.getArtistTopTracks($route.current.params.id, env.REGION_CODE);
                    }],
                    relatedArtists: ["Spotify", "$route", function (Spotify, $route){
                        return Spotify.getRelatedArtists($route.current.params.id);
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
 * @param {Array}  albums
 * @param {Array}  singles
 * @param {Array}  topTracks
 * @param {Array}  relatedArtists
 * @param {Object} env
 */
.controller("ArtistDetailCtrl", [
    "$scope",
    "$location",
    "Spotify",
    "artist",
    "albums",
    "singles",
    "topTracks",
    "relatedArtists",
    "env",
    function ($scope, $location, Spotify, artist, albums, singles, topTracks, relatedArtists, env) {

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
         * @property albumsMeta
         * @type {Object}
         */
        $scope.albumsMeta = albums;

        /**
         * List of artist singles
         * @property singles
         * @type {Array}
         */
        $scope.singles = singles.items;

        /**
         * Albums list meta data
         * @property singlesMeta
         * @type {Object}
         */
        $scope.singlesMeta = singles;

        /**
         * List of artist top tracks
         * @property topTracks
         * @type {Array}
         */
        $scope.topTracks = topTracks.tracks;

        /**
         * @property relatedArtists
         * @type {Array}
         */
        $scope.relatedArtists = relatedArtists.artists;

        /**
         * @property loadDisabled
         * @type {Boolean}
         */
        $scope.loadDisabled = false;

        /**
         * Load more artist singles
         * @method loadMoreSingles
         */
        $scope.loadMoreSingles = function loadMoreSingles(){
            $scope.loadDisabled = true;
            Spotify.getArtistAlbums($scope.artist.id, {
                limit: env.SEARCH_LIMIT,
                album_type: "single", // jshint ignore:line
                offset: $scope.singles.length,
                country: env.REGION_CODE
            }).then(function (response) {
                $scope.singles = $scope.singles.concat(response.items);
                $scope.singlesMeta = response;
                $scope.loadDisabled = false;
            });
        };

        /**
         * Load more artist albums
         * @method loadMoreAlbums
         */
        $scope.loadMoreAlbums = function loadMoreAlbums(){
            $scope.loadDisabled = true;
            Spotify.getArtistAlbums($scope.artist.id, {
                limit: env.SEARCH_LIMIT,
                album_type: "album", // jshint ignore:line
                offset: $scope.albums.length,
                country: env.REGION_CODE
            }).then(function (response) {
                $scope.albums = $scope.albums.concat(response.items);
                $scope.albumsMeta = response;
                $scope.loadDisabled = false;
            });
        };

    }

]);
