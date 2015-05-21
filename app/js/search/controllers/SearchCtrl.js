"use strict";
/**
 * Controller for thisissoon FM spotify search, handles searching
 * the spotify api for songs using ngMaterial autocomplete and
 * angular-spotify
 * @module FM.search.SearchCtrl
 * @author SOON_
 */
angular.module("FM.search.SearchCtrl", [
    "FM.api.PlayerQueueResource",
    "spotify"
])
/**
 * @constructor
 * @class SearchCtrl
 * @param {Object}  $scope
 * @param {Service} $q
 * @param {Service} Spotify
 * @param {Factory} PlayerQueueResource
 */
.controller("SearchCtrl", [
    "$scope",
    "$q",
    "Spotify",
    "PlayerQueueResource",
    function ($scope, $q, Spotify, PlayerQueueResource) {

        /**
         * Searches the spotify api unsing angular-spotify and returns a
         * promise containing the search results limited to 20
         * @method search
         * @param  {String}  query Query string to search spotify database
         * @return {Promise} Promise containing the results of the search
         */
        $scope.search = function search(query){
            var deferred = $q.defer();

            Spotify.search(query, "track", { limit: 20, market: "GB" })
                .then(function (response) {
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
            if (track && track.uri) {
                PlayerQueueResource.save({ uri: track.uri });
            }
        };

    }

]);
