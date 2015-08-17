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
    "FM.api.PaginationInterceptor",
    "FM.player.removeLeadingZeros",
    "ngRoute",
    "config"
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
    "env",
    function ($scope, $q, TracksResource, UsersResource, PlayerQueueResource, playlistData, playlistMeta, env) {

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
         * Paging properties
         * @property {Object} page
         */
        $scope.page = {
            loading: false,
            pages: 1,
            total: playlistData.meta.totalPages || 1
        };

        /**
         * Update `playlist` with queue data from the API
         * @method refreshPlaylist
         */
        $scope.refreshPlaylist = function refreshPlaylist(){
            PlayerQueueResource.query().$promise
                .then(function (response){
                    $scope.playlist = response.items;
                    $scope.page.total = response.meta.totalPages;
                    $scope.page.pages = 1;
                });

            PlayerQueueResource.meta().$promise
                .then(function (response){
                    $scope.meta = response;
                });
        };

        /**
         * Load more tracks from playlist
         * @method loadMore
         */
        $scope.loadMore = function loadMore() {

            $scope.page.loading = true;
            $scope.page.pages++;

            PlayerQueueResource.query({ page: $scope.page.pages }).$promise
                .then(function (response){
                    $scope.playlist = $scope.playlist.concat(response.items);

                    $scope.page.loading = false;
                    $scope.page.total = response.meta.totalPages ? response.meta.totalPages : 1;
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
            if (($scope.playlist[0].track.uri === data.uri) && ($scope.page.pages === $scope.page.total)) { // jshint ignore:line
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
                TracksResource.get({ id: data.uri }).$promise,
                UsersResource.get({ id: data.user }).$promise
            ]).then(function (response){
                var item = {
                    track: response[0],
                    user: response[1]
                };
                if ($scope.page.pages === $scope.page.total) {
                    $scope.playlist.push(item);
                } else if ( ($scope.meta.total + 1) > (env.SEARCH_LIMIT * $scope.page.total) ) {
                    $scope.page.total++;
                }
                $scope.meta.total++;
                $scope.meta.play_time = $scope.meta.play_time + response[0].duration; //jshint ignore:line
            });
        };

        /**
         * On delete event, remove track from playlist
         * refresh playlist if song URI doesn't match the playlist
         * @method onDeleted
         */
        $scope.onDeleted = function onDeleted(event, data) {
            angular.forEach($scope.playlist, function (track, $index){
                if (track.uuid === data.uuid){
                    $scope.meta.total--;
                    $scope.meta.play_time = $scope.meta.play_time - $scope.playlist[$index].track.duration; // jshint ignore:line
                    $scope.playlist.splice($index, 1);
                }
            });
        };

        $scope.$on("fm:player:play", $scope.onPlay);
        $scope.$on("fm:player:end", $scope.onEnd);
        $scope.$on("fm:player:add", $scope.onAdd);
        $scope.$on("fm:player:deleted", $scope.onDeleted);

    }

]);
