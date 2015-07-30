"use strict";
/**
 * @module   FM.users.UserPlaylistsCtrl
 * @author   SOON_
 */
angular.module("FM.users.UserPlaylistsCtrl", [
    "FM.api.UsersResource",
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
                    playlists: ["$q", "SpotifyAuth", "Spotify", function ($q, SpotifyAuth, Spotify){
                        var deferred = $q.defer();

                        SpotifyAuth.getCurrentUser()
                            .then(function (response){
                                Spotify.getUserPlaylists(response.id, {})
                                    .then(function (response){
                                        deferred.resolve(response);
                                    })
                                    .catch(function (){
                                        deferred.reject({});
                                    });
                            })
                            .catch(function(){
                                deferred.resolve({});
                            });

                        return deferred.promise;
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
