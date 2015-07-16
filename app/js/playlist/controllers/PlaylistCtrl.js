"use strict";
/**
 * @module   FM.playlist.PlaylistCtrl
 * @author   SOON_
 * @requires FM.api.TracksResource
 * @requires FM.api.UsersResource
 * @requires FFM.api.PlayerQueueResource
 * @requires ngRoute
 */
angular.module("FM.playlist.PlaylistCtrl", [
    "FM.api.TracksResource",
    "FM.api.UsersResource",
    "FM.api.PlayerQueueResource",
    "ngRoute",
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
                    }],
                    playlistMeta: ["PlayerQueueResource", function (PlayerQueueResource){
                        return PlayerQueueResource.meta().$promise;
                    }],
                }
            });

    }
])
/**
 * @constructor
 * @class PlaylistCtrl
 * @param {Object}  $scope
 * @param {Service} $q
 * @param {Factory} TracksResource
 * @param {Factory} UsersResource
 * @param {Factory} PlayerQueueResource
 * @param {Array}   playlistData
 * @param {Object}  playlistMeta
 */
.controller("PlaylistCtrl", [
    "$scope",
    "$q",
    "TracksResource",
    "UsersResource",
    "PlayerQueueResource",
    "playlistData",
    "playlistMeta",
    function ($scope, $q, TracksResource, UsersResource, PlayerQueueResource, playlistData, playlistMeta) {

        /**
         * @property playlist
         * @type {Array}
         */
        $scope.playlist = playlistData.items;

        /**
         * @property meta
         * @type {Object}
         */
        $scope.meta = playlistMeta;

        /**
         * Update `playlist` with queue data from the API
         * @method refreshPlaylist
         */
        $scope.refreshPlaylist = function refreshPlaylistQueue(){
            PlayerQueueResource.query().$promise
                .then(function (response){
                    $scope.playlist = response.items;
                });
            PlayerQueueResource.meta().$promise
                .then(function (response){
                    $scope.meta = response;
                });
        };

        /**
         * On play event, set playback state variables
         * refresh playlist if song URI doesn't match the playlist
         * @method onPlay
         */
        $scope.onPlay = function onPlay() {
            $scope.refreshPlaylist();
        };

        /**
         * On end event, remove track from playlist
         * refresh playlist if song URI doesn't match the playlist
         * @method onEnd
         */
        $scope.onEnd = function onEnd(event, data) {
            if ($scope.playlist[0].track.uri === data.uri) { // jshint ignore:line
                $scope.meta.total--;
                $scope.meta.play_time = $scope.meta.play_time - $scope.playlist[0].track.duration; // jshint ignore:line
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
                TracksResource.get({ id: data.uri }).$promise
            ]).then(function (response){
                var item = {
                    track: response[0],
                    user: response[1]
                };
                $scope.playlist.push(item);
                $scope.meta.total++;
                $scope.meta.play_time = $scope.meta.play_time + response[0].duration; //jshint ignore:line
            });
        };

        $scope.$on("fm:player:play", $scope.onPlay);
        $scope.$on("fm:player:end", $scope.onEnd);
        $scope.$on("fm:player:add", $scope.onAdd);

    }

]);
