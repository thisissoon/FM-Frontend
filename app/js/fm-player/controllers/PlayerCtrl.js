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
    "PlayerMuteResource",
    "PlayerVolumeResource",
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
    function ($scope, $q, Spotify, PlayerQueueResource, PlayerTransportResource, TracksResource, PlayerMuteResource, PlayerVolumeResource, playlistData, currentTrack) {

        /**
         * An instance of the $resource PlayerQueueResource
         * which contains a list of the thisissoon FM queue
         * @property playlist
         * @type     {Object}
         */
        $scope.playlist = playlistData;

        /**
         * The currently playing track
         * @property current
         * @type     {Object}
         */
        $scope.current = currentTrack.track;

        /**
         * Tracks the state of playback
         * @property paused
         * @type     {Boolean}
         */
        $scope.paused = currentTrack.paused;

        /**
         * An instance of the $resource PlayerMuteResource
         * which provides player mute operations
         * @property mute
         * @type     {Object}
         */
        $scope.mute = PlayerMuteResource;

        /**
         * Set paused state and send request to API
         * @method resume
         */
        $scope.resume = function resume() {
            $scope.paused = false;
            PlayerTransportResource.resume();
        };

        /**
         * Set paused state and send request to API
         * @method pause
         */
        $scope.pause = function pause() {
            $scope.paused = true;
            PlayerTransportResource.pause({});
        };

        /**
         * Increment volume by 10
         * @method volumeUp
         */
        $scope.volumeUp = function volumeUp() {
            PlayerVolumeResource.get({}, function(volume){

                // round volume to nearest 10
                volume.volume = Math.round(volume.volume / 10) * 10;
                volume.volume = volume.volume + 10;

                if (volume.volume > 100) {
                    volume.volume = 100;
                }

                volume.$save();

            });
        };

        /**
         * Decrement volume by 10
         * @method volumeDown
         */
        $scope.volumeDown = function volumeDown() {
            PlayerVolumeResource.get({}, function(volume){

                // round volume to nearest 10
                volume.volume = Math.round(volume.volume / 10) * 10;
                volume.volume = volume.volume - 10;

                if (volume.volume < 0) {
                    volume.volume = 0;
                }

                volume.$save();
            });
        };

        /**
         * Toggle mute state and save
         * @method toggleMute
         */
        $scope.toggleMute = function toggleMute() {
            if ($scope.mute.mute) {
                $scope.mute.mute = false;
                $scope.mute.$delete();
            } else {
                $scope.mute.mute = true;
                $scope.mute.$save();
            }
        };

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
            if ($scope.current.id){
                $scope.playlist.unshift($scope.current);
            }
        };

        /**
         * On play event, set playback state variables
         * refresh playlist if song URI doesn't match the playlist
         * @method onPlay
         */
        $scope.onPlay = function onPlay(event, data) {
            if ($scope.playlist[0].spotify_uri === data.uri) { // jshint ignore:line
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
            if ($scope.playlist[0].spotify_uri === data.uri) { // jshint ignore:line
                $scope.playlist.splice(0, 1);
            } else {
                $scope.refreshPlaylist();
            }
        };

        /**
         * On pause event, update paused state
         * @method onPause
         */
        $scope.onPause = function onPause() {
            $scope.paused = true;
        };

        /**
         * On resume event, update paused state
         * @method onResume
         */
        $scope.onResume = function onResume() {
            $scope.paused = false;
        };

        /**
         * On add event, get track data and push to playlist
         * @method onAdd
         */
        $scope.onAdd = function onAdd(event, data) {
            TracksResource.get({ id: data.uri }).$promise
                .then(function(track){
                    $scope.playlist.push(track);
                });
        };

        /**
         * On setMute event, set mute status
         * @method onSetMute
         */
        $scope.onSetMute = function onSetMute(event, data) {
            $scope.mute.mute = data.mute;
        };

        /**
         * @listens fm:player:play
         */
        $scope.$on("fm:player:play", $scope.onPlay);

        /**
         * @listens fm:player:end
         */
        $scope.$on("fm:player:end", $scope.onEnd);

        /**
         * @listens fm:player:pause
         */
        $scope.$on("fm:player:pause", $scope.onPause);

        /**
         * @listens fm:player:resume
         */
        $scope.$on("fm:player:resume", $scope.onResume);

        /**
         * @listens fm:player:pause
         */
        $scope.$on("fm:player:add", $scope.onAdd);

        /**
         * @listens fm:player:setMute
         */
        $scope.$on("fm:player:setMute", $scope.onSetMute);

        $scope.init();

    }

]);
