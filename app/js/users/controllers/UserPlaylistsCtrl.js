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
                    }]
                }
            });

    }
])
/**
 * @constructor
 * @class UserPlaylistsCtrl
 * @param {Object}  $scope      Scoped application data
 * @param {Service} Spotify     Spotify API wrapper
 * @param {Service} SpotifyAuth Authentication service for Spotify
 * @param {Object}  user        User object resolved from API
 * @param {Object}  env         App enviroment variables
 */
.controller("UserPlaylistsCtrl", [
    "$scope",
    "Spotify",
    "SpotifyAuth",
    "user",
    "env",
    function ($scope, Spotify, SpotifyAuth, user, env) {

        /**
         * @property {Object} user
         */
        $scope.user = user;

        /**
         * @property playlists
         * @type {Array}
         */
        $scope.playlists = null;

        /**
         * User playlists meta data
         * @property meta
         * @type {Object}
         */
        $scope.meta = null;

        /**
         * @property loadDisabled
         * @type {Boolean}
         */
        $scope.loadDisabled = false;

        /**
         * @property SpotifyAuth
         * @type {Object}
         */
        $scope.authenticated = function authenticated(){
            return SpotifyAuth.isAuthenticated();
        };

        /**
         * Load more search results
         * @method loadMore
         */
        $scope.loadMore = function loadMore(){
            $scope.loadDisabled = true;
            SpotifyAuth.getUserPlaylists({
                limit: env.SEARCH_LIMIT,
                offset: ($scope.playlists && $scope.playlists.length) ? $scope.playlists.length : 0
            }).then(function (response) {
                $scope.playlists = ($scope.playlists && $scope.playlists.concat) ? $scope.playlists.concat(response.items) : response.items;
                $scope.meta = response;
                $scope.loadDisabled = false;
            });
        };

        /**
         * Action to perform when spotify suth status has changed.
         * Loads users playlists if authenticated or removes playlists
         * when logged out.
         * @method onAuthChange
         * @param  {Boolean} isAuthenticated
         */
        $scope.onAuthChange = function onAuthChange(isAuthenticated){
            if (isAuthenticated) {
                $scope.loadMore();
            } else {
                $scope.playlists = null;
            }
        };

        $scope.$watch($scope.authenticated, $scope.onAuthChange);

    }
]);
