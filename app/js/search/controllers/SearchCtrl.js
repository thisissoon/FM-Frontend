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
    "FM.api.PlayerSpotifySearchResource",
    "FM.api.PlayerSpotifyAlbumResource",
    "ui.bootstrap",
    "config"
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
    "$location",
    "env",
    "PlayerSpotifySearchResource",
    "PlayerSpotifyAlbumResource",
    "PlayerQueueResource",
    function ($scope, $rootScope, $q, $location, env, PlayerSpotifySearchResource,PlayerSpotifyAlbumResource, PlayerQueueResource) {

        /**
         * Searches the spotify api using angular-spotify and returns a
         * promise containing the search results limited to 20
         * @method search
         * @param  {String}  query Query string to search spotify database
         * @return {Promise} Promise containing the results of the search
         */
        $scope.search = function search(query){
            var deferred = $q.defer();

            PlayerSpotifySearchResource.query({
                q: query + "*",
                type: "album,artist,track",
                limit: env.SIDEBAR_SEARCH_LIMIT,
                market: env.REGION_CODE
            }).$promise.then(function (response) {
                var albums = (response.albums && response.albums.items && response.albums.items.length > 0),
                    tracks = (response.tracks && response.tracks.items && response.tracks.items.length > 0),
                    artists = (response.artists && response.artists.items && response.artists.items.length > 0),
                    results = [];

                if (tracks) {
                    results = results.concat([{ label: "Tracks" }])
                                     .concat(response.tracks.items)
                                     .concat([{ buttonLabel: "tracks" }]);
                }

                if (artists) {
                    results = results.concat([{ label: "Artists" }])
                                     .concat(response.artists.items)
                                     .concat([{ buttonLabel: "artists" }]);
                }

                if (albums) {
                    var promises = [];
                    angular.forEach(response.albums.items, function (album){
                        promises.push(PlayerSpotifyAlbumResource.get({ id: album.uri.replace("spotify:album:", "") }).$promise);
                    });
                    $q.all(promises)
                        .then(function (response){
                            results = results.concat([{ label: "Albums" }])
                                             .concat(response)
                                             .concat([{ buttonLabel: "albums" }]);

                            deferred.resolve(results);
                        });

                } else {
                    deferred.resolve(results);
                }


            });

            return deferred.promise;
        };

        /**
         * POST the selected track to the thisissoon FM API PlayerQueueResource
         * to add it to the playlist
         * @method onTrackSelected
         * @param {Object} item The selected track from the spotify search
         */
        $scope.onTrackSelected = function onTrackSelected(item){
            if (item && item.uri && item.uri.match("spotify:track")) {
                PlayerQueueResource.save({ uri: item.uri });
            } else if (item && item.uri && item.uri.match("spotify:album")) {
                $location.path("/albums/"+item.uri);
            } else if (item && item.uri && item.uri.match("spotify:artist")) {
                $location.path("/artists/"+item.uri);
            }
            $scope.selectedItem = null;
            $rootScope.toogleSidebar();
        };

    }

]);
