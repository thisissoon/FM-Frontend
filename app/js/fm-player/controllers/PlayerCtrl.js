"use strict";
/**
 * Controller for thisissoon FM player view, handles searching
 * the spotify api for songs using ngMaterial autocomplete and
 * angular-spotify
 * @class  PlayerCtrl
 * @module sn.fm.player
 * @author SOON_
 */
angular.module("sn.fm.player").controller("PlayerCtrl", [
    "$scope",
    "$q",
    "Spotify",
    "PlayerQueueResource",
    "PlayerTransportResource",
    "TracksResource",
    "playlistData",
    "currentTrack",
    /**
     * @constructor
     * @param {Object}  $scope
     * @param {Service} $q
     * @param {Service} Spotify
     * @param {Factory} PlayerQueueResource
     * @param {Factory} PlayerTranportResource
     * @param {Factory} TracksResource
     * @param {Array}   playlistData
     * @param {Object}  currentTrack
     */
    function ($scope, $q, Spotify, PlayerQueueResource, PlayerTransportResource, TracksResource, playlistData, currentTrack) {

        /**
         * An instance of the $resource PlayerQueueResource
         * which contains a list of the thisissoon FM queue
         * @property playlist
         * @type     {Object}
         */
        $scope.playlist = playlistData;

        /**
         * An instance of the $resource PlayerTransportResource
         * which provides player transport operations and information
         * about the currently playing track
         * @property transport
         * @type     {Object}
         */
        $scope.transport = PlayerTransportResource;

        /**
         * The currently playing track
         * @property current
         * @type     {Object}
         */
        $scope.current = currentTrack;

        /**
         * Tracks the state of playback
         * @property paused
         * @type     {Boolean}
         */
        $scope.paused = false;

        /**
         * Searches the spotify api unsing angular-spotify and returns a
         * promise containing the search results limited to 20
         * @method search
         * @param  {String}  query Query string to search spotify database
         * @return {Promise}       Promise containing the results of the search
         */
        $scope.search = function search(query){
            var deferred = $q.defer();

            Spotify.search(query, "track", { limit: 20 }).then(function (response) {
                deferred.resolve(response.tracks.items);
            });

            return deferred.promise;
        };

        /**
         * POST the selected track to the thisissoon FM API PlayerQueueResource
         * to add it to the playlist
         * @method onTrackSelected
         * @param  {Object} track The selected track from the spotify search
         */
        $scope.onTrackSelected = function onTrackSelected(track){
            PlayerQueueResource.save({ uri: track.uri });
        };

        /**
         * Update `playlist` and `current` with queue data and currently playing track from the API
         * @method refreshPlaylist
         */
        $scope.refreshPlaylist = function refreshPlaylistQueue(){
            $q.all([
                PlayerQueueResource.get().$promise,
                PlayerTransportResource.get().$promise
            ]).then(function(response){
                $scope.playlist = response[0];
                $scope.current = response[1];
                $scope.playlist.unshift($scope.current);
            });
        };

        /**
         * Add currently playing track to playlist
         * @method init
         */
        $scope.init = function init() {
            $scope.playlist.unshift($scope.current);
        };

        /**
         * On play event, remove previous track from playlist and set
         * playback state variables
         * @listens fm:player:play
         */
        $scope.$on("fm:player:play", function (event, data) {

            if ($scope.playlist[1].spotify_uri === data.uri) { // jshint ignore:line
                $scope.playlist.splice(0, 1);
                $scope.paused = false;
                $scope.current = $scope.playlist[0];
            } else {
                $scope.refreshPlaylist();
                $scope.paused = false;
            }

        });

        /**
         * On pause event, update paused state
         * @listens fm:player:pause
         */
        $scope.$on("fm:player:pause", function () {
            $scope.paused = true;
        });

        /**
         * On resume event, update paused state
         * @listens fm:player:resume
         */
        $scope.$on("fm:player:resume", function () {
            $scope.paused = false;
        });

        /**
         * On add event, get track data and push to playlist
         * @listens fm:player:pause
         */
        $scope.$on("fm:player:add", function (event, data) {
            TracksResource.get({ id: data.uri }).$promise
                .then(function(track){
                    $scope.playlist.push(track);
                });
        });

        $scope.init();

    }

]);
