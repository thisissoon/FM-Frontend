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
    "ui.bootstrap",
    "spotify"
])
/**
 * @constructor
 * @class SearchCtrl
 * @param {Object}  $scope
 * @param {Service} $rootScope
 * @param {Service} $q
 * @param {Service} Spotify
 * @param {Factory} PlayerQueueResource
 */
.controller("SearchCtrl", [
    "$scope",
    "$rootScope",
    "$q",
    "Spotify",
    "PlayerQueueResource",
    function ($scope, $rootScope, $q, Spotify, PlayerQueueResource) {

        /**
         * Searches the spotify api using angular-spotify and returns a
         * promise containing the search results limited to 20
         * @method search
         * @param  {String}  query Query string to search spotify database
         * @return {Promise} Promise containing the results of the search
         */
        $scope.search = function search(query){
            var deferred = $q.defer();

            Spotify.search(query, "album,artist,track", { limit: 3, market: "GB" })
                .then(function (response) {
                    var results = response.tracks.items.concat(response.artists.items.concat(response.albums.items));
                    deferred.resolve(results);
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
            $scope.selectedItem = null;
            $rootScope.toogleSidebar();
        };

    }

]);
