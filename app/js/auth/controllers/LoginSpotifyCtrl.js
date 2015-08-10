"use strict";
/**
 * Controller to handle Spotify Login
 * @module FM.auth.LoginSpotifyCtrl
 * @author SOON_
 */
angular.module("FM.auth.LoginSpotifyCtrl", [
    "FM.auth.SpotifyAuthService"
])
/**
 * @constructor
 * @class LoginSpotifyCtrl
 * @param {Object}  $scope
 * @param {Service} SpotifyAuth
 */
.controller("LoginSpotifyCtrl", [
    "$scope",
    "SpotifyAuth",
    function ($scope, SpotifyAuth) {

        /**
         * Get current spotify user object
         * @method spotifyUser
         * @return {Object} Spotify user object
         */
        $scope.getUser = function getUser(){
            return SpotifyAuth.user;
        };

        /**
         * Authenticate with spotify OAuth
         * @method authenticate
         */
        $scope.authenticate = function authenticate() {
            SpotifyAuth.authenticate();
        };

        /**
         * Set isAuthenticatedSpotify if user exists
         * @method isAuthenticatedSpotify
         * @return {Boolean} user is authenticated
         */
        $scope.isAuthenticated = function isAuthenticated() {
            return SpotifyAuth.isAuthenticated();
        };

    }

]);
