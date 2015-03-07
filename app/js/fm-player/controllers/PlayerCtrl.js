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
    "PlayerPlaylistResource",
    /**
     * @constructor
     * @param {Object}  $scope
     * @param {Service} $q
     * @param {Service} Spotify
     * @param {Factory} PlayerPlaylistResource
     */
    function ($scope, $q, Spotify, PlayerPlaylistResource) {

        /**
         * An instance of the $resource PlayerPlaylistResource
         * which contains a list of the thisissoon FM playlist
         * @property playlist
         * @type     {Object}
         */
        $scope.playlist = PlayerPlaylistResource;

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
         * POST the selected track to the thisissoon FM API PlayerPlaylistResource
         * to add it to the playlist
         * @method onTrackSelected
         * @param  {Object} track The selected track from the spotify search
         */
        $scope.onTrackSelected = function onTrackSelected(track){
            PlayerPlaylistResource.save({ uri: track.uri });
        };

    }

]);
