"use strict";
/**
 * @module   FM.users.UserPlaylistDetailCtrl
 * @author   SOON_
 * @requires spotify
 * @requires ngRoute
 * @requires config
 * @requires FM.player.trackDirective
 */
angular.module("FM.users.UserPlaylistDetailCtrl", [
    "spotify",
    "ngRoute",
    "config",
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
            .when("/users/:userId/playlists/:playlistId", {
                templateUrl: "partials/users/playlist-detail.html",
                controller: "UserPlaylistDetailCtrl",
                resolve: {
                    playlist: ["Spotify", "$route", function (Spotify, $route){
                        return Spotify.getPlaylist($route.current.params.userId, $route.current.params.playlistId);
                    }],
                    playlistTracks: ["Spotify", "$route", function (Spotify, $route){
                        return Spotify.getPlaylistTracks($route.current.params.userId, $route.current.params.playlistId, {
                            limit: env.SEARCH_LIMIT
                        });
                    }]
                }
            });

    }
])
/**
 * @constructor
 * @class UserPlaylistDetailCtrl
 * @param {Object} $scope
 * @param {Array}  Spotify
 * @param {Object} playlist
 * @param {Object} playlistTracks
 */
.controller("UserPlaylistDetailCtrl", [
    "$scope",
    "Spotify",
    "playlist",
    "playlistTracks",
    "env",
    function ($scope, Spotify, playlist, playlistTracks, env) {

        /**
         * Playlist data
         * @property playlist
         * @type {Object}
         */
        $scope.playlist = playlist;

        /**
         * List of artist playlists
         * @property playlistTracks
         * @type {Array}
         */
        $scope.playlistTracks = playlistTracks.items;

        /**
         * playlists track list meta data
         * @property meta
         * @type {Object}
         */
        $scope.meta = playlistTracks;

        /**
         * @property loadDisabled
         * @type {Boolean}
         */
        $scope.loadDisabled = false;

        /**
         * Load more playlist tracks
         * @method loadMore
         */
        $scope.loadMore = function loadMore(){
            $scope.loadDisabled = true;
            Spotify.getPlaylistTracks($scope.playlist.owner.id, $scope.playlist.id, {
                limit: env.SEARCH_LIMIT,
                offset: $scope.playlistTracks.length
            }).then(function (response) {
                $scope.playlistTracks = $scope.playlistTracks.concat(response.items);
                $scope.meta = response;
                $scope.loadDisabled = false;
            });
        };

    }

]);
