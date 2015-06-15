"use strict";
/**
 * @module   FM.playlist.PlaylistCtrl
 * @author   SOON_
 * @requires sn.fm.api
 * @requires ngRoute
 */
angular.module("FM.playlist.PlaylistCtrl", [
    "FM.api.TracksResource",
    "FM.api.UsersResource",
    "FM.api.PlayerQueueResource",
    "ngRoute",
    "notification"
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
 * @param {Object}  $scope
 * @param {Service} $q
 * @param {Service} $notification
 * @param {Factory} TracksResource
 * @param {Factory} UsersResource
 * @param {Factory} PlayerQueueResource
 * @param {Array}   playlistData
 */
.controller("PlaylistCtrl", [
    "$scope",
    "$q",
    "$notification",
    "TracksResource",
    "UsersResource",
    "PlayerQueueResource",
    "playlistData",
    function ($scope, $q, $notification, TracksResource, UsersResource, PlayerQueueResource, playlistData) {

        /**
         * @property playlist
         * @type {Array}
         */
        $scope.playlist = playlistData.items;

        /**
         * Update `playlist` with queue data from the API
         * @method refreshPlaylist
         */
        $scope.refreshPlaylist = function refreshPlaylistQueue(){
            PlayerQueueResource.query().$promise
                .then(function (response){
                    $scope.playlist = response.items;
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

                if (item.track && item.user) {
                    $notification("Track Added", {
                        body: item.user.display_name + " added " + item.track.artists[0].name + " - " + item.track.album.name + ": " + item.track.name, //jshint ignore:line
                        icon: item.track.album.images[0].url
                    });
                }
            });
        };

        $scope.$on("fm:player:play", $scope.onPlay);
        $scope.$on("fm:player:end", $scope.onEnd);
        $scope.$on("fm:player:add", $scope.onAdd);

    }

]);
