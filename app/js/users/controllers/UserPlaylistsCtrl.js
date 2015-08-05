"use strict";
/**
 * @module   FM.users.UserPlaylistsCtrl
 * @author   SOON_
 */
angular.module("FM.users.UserPlaylistsCtrl", [
    "FM.api.UsersResource",
    "FM.auth.SpotifyAuthService",
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
            .when("/users/:id/playlists", {
                templateUrl: "partials/users/playlists.html",
                controller: "UserPlaylistsCtrl",
                resolve: {
                    user: ["UsersResource", "$route", function (UsersResource, $route){
                        return UsersResource.get($route.current.params).$promise;
                    }],
                    playlists: ["SpotifyAuth", function (SpotifyAuth){
                        return SpotifyAuth.getUserPlaylists();
                    }]
                }
            });

    }
])
/**
 * @constructor
 * @class UserPlaylistsCtrl
 * @param {Object}   $scope    Scoped application data
 * @param {Object}   Spotify   Spotify api service
 * @param {Object}   user      User object resolved from API
 * @param {Object}   Playlists User playlist from spotify
 */
.controller("UserPlaylistsCtrl", [
    "$scope",
    "SpotifyAuth",
    "user",
    "playlists",
    "env",
    function ($scope, SpotifyAuth, user, playlists, env) {

        /**
         * User
         * @property {Object} user
         */
        $scope.user = user;

        /**
         * @property playlists
         * @type {Object}
         */
        $scope.playlists = playlists.items;

        /**
         * Search meta data
         * @property meta
         * @type {Object}
         */
        $scope.meta = playlists;

        /**
         * @property loadDisabled
         * @type {Boolean}
         */
        $scope.loadDisabled = false;

        /**
         * Load more search results
         * @method loadMore
         */
        $scope.loadMore = function loadMore(){
            $scope.loadDisabled = true;
            SpotifyAuth.getUserPlaylists({
                limit: env.SEARCH_LIMIT,
                offset: $scope.playlists.length
            }).then(function (response) {
                $scope.playlists = $scope.playlists.concat(response.items);
                $scope.meta = response;
                $scope.loadDisabled = false;
            });
        };

    }
]);
