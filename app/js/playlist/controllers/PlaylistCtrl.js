"use strict";
/**
 * @module   FM.playlist.PlaylistCtrl
 * @author   SOON_
 * @requires sn.fm.api
 * @requires ngRoute
 */
angular.module("FM.playlist.PlaylistCtrl", [
    "sn.fm.api",
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
            .when("/", {
                templateUrl: "partials/playlist.html",
                controller: "PlaylistCtrl",
                resolve: {
                    playlistData: ["PlayerQueueResource", "$route", function (PlayerQueueResource, $route){
                        return PlayerQueueResource.query($route.current.params).$promise;
                    }]
                }
            });

    }
])
/**
 * @constructor
 * @class PlaylistCtrl
 * @param {Object} $scope
 * @param {Array}  playlistData
 */
.controller("PlaylistCtrl", [
    "$scope",
    "$q",
    "TracksResource",
    "UsersResource",
    "PlayerQueueResource",
    "playlistData",
    function ($scope, $q, TracksResource, UsersResource, PlayerQueueResource, playlistData) {

        /**
         * @property playlist
         * @type {Array}
         */
        $scope.playlist = playlistData;

        /**
         * Update `playlist` with queue data from the API
         * @method refreshPlaylist
         */
        $scope.refreshPlaylist = function refreshPlaylistQueue(){
            PlayerQueueResource.query().$promise
                .then(function (response){
                    $scope.playlist = response;
                });
        };

        /**
         * On play event, set playback state variables
         * refresh playlist if song URI doesn't match the playlist
         * @method onPlay
         */
        $scope.onPlay = function onPlay(event, data) {
            if ($scope.playlist[0].track.uri === data.uri) { // jshint ignore:line
                $scope.paused = false;
                $scope.current = $scope.playlist[0];
            } else {
                $scope.refreshPlaylist();
                $scope.paused = false;
            }
        };

        /**
         * On end event, remove track from playlist
         * refresh playlist if song URI doesn't match the playlist
         * @method onEnd
         */
        $scope.onEnd = function onEnd(event, data) {
            if ($scope.playlist[0].track.uri === data.uri) { // jshint ignore:line
                $scope.playlist.splice(0, 1);
            } else {
                $scope.refreshPlaylist();
            }
        };

        /**
         * On add event, get track data and push to playlist
         * @method onAdd
         */
        $scope.onAdd = function onAdd(event, data) {
            $q.all([
                TracksResource.get({ id: data.uri }).$promise,
                UsersResource.get({ id: data.user }).$promise
            ]).then(function(response){
                var item = {
                    track: response[0],
                    user: response[1]
                };
                $scope.playlist.push(item);
            });
        };

        $scope.$on("fm:player:play", $scope.onPlay);
        $scope.$on("fm:player:end", $scope.onEnd);
        $scope.$on("fm:player:add", $scope.onAdd);

    }

]);
