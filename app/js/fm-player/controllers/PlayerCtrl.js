"use strict";
/**
 * Controller for thisissoon FM player
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
     * @param {Object} $scope
     */
    function ($scope, $q, Spotify, PlayerPlaylistResource) {

        $scope.selectedItem = null;

        $scope.searchText = null;

        $scope.search = function search(query){
            var deferred = $q.defer();

            Spotify.search(query, "track", { limit: 20 }).then(function (response) {
                deferred.resolve(response.tracks.items);
            });

            return deferred.promise;
        };

        $scope.onTrackSelected = function onTrackSelected(track){
            console.log(arguments);
            PlayerPlaylistResource.save({ uri: track.uri });
        };

    }

]);
