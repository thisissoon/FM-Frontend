"use strict";
/**
 * @module   FM.users.UserPlaylistsCtrl
 * @author   SOON_
 */
angular.module("FM.users.UserPlaylistsCtrl", [
    "FM.api.UsersResource",
    "FM.auth.SpotifyAuthService",
    "ngRoute",
    "spotify"
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
 * @param {Object}   user      User object resolved from API
 * @param {Object}   Playlists User playlist from spotify
 */
.controller("UserPlaylistsCtrl", [
    "$scope",
    "user",
    "playlists",
    function ($scope, user, playlists) {

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

    }
]);
