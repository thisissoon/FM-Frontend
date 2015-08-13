"use strict";
/**
 * listens to event from FM Socket
 * to display notifications from the
 * playlist and current track
 * @module FM.auth.SpotifyAuthService
 * @author SOON_
 */
angular.module("FM.auth.SpotifyAuthService", [
    "FM.alert",
    "FM.api.ERRORS",
    "spotify"
])
/**
 * @constant
 * @property {String} TOKEN_NAME
 */
.constant("TOKEN_NAME", "spotify-token")
/**
 * @class SpotifyAuth
 * @param {Service} $window
 * @param {Service} $q
 * @param {Object}  ERRORS
 * @param {Service} Spotify
 * @param {Service} AlertService
 * @param {String}  TOKEN_NAME
 */
.service("SpotifyAuth", [
    "$window",
    "$q",
    "ERRORS",
    "Spotify",
    "AlertService",
    "TOKEN_NAME",
    function ($window, $q, ERRORS, Spotify, AlertService, TOKEN_NAME){

        var _this = this;

        /**
         * Spotify user object
         * @private
         * @property {Object} user
         */
        var user = null;

        /**
         * Whether the user is authenticated
         * @private
         * @property {Object} authenticated
         */
        var authenticated = false;

        /**
         * @private
         * @method login
         * @return {Promise} Spotify auth token
         */
        var login = function login(){
            var deferred = $q.defer();

            Spotify.login()
                .then(function (response){
                    if (response && typeof response === "string"){
                        Spotify.setAuthToken(response);
                        $window.localStorage.setItem(TOKEN_NAME, response);
                        authenticated = true;
                        deferred.resolve(response);
                    } else {
                        AlertService.set(ERRORS.AUTH_VALIDATION_TITLE, response.error.status);
                        authenticated = false;
                        $window.localStorage.removeItem(TOKEN_NAME);
                        deferred.reject(response);
                    }
                });

            return deferred.promise;
        };

        /**
         * @private
         * @method getCurrentUser
         * @return {Promise} current spotify user object
         */
        var getCurrentUser = function getCurrentUser(){
            var deferred = $q.defer();

            Spotify.getCurrentUser()
                .then(function (response){
                    if (response && !response.error){
                        user = response;
                        deferred.resolve(response);
                    } else {
                        user = null;
                        deferred.reject(response);
                    }
                });

            return deferred.promise;
        };

        /**
         * Authenticate with spotify OAuth
         * @public
         * @method authenticate
         * @return {Object}  Spotify     user object
         */
        this.authenticate = function authenticate() {
            var deferred = $q.defer();

            login()
                .then(function (response){
                    authenticated = true;
                    deferred.resolve(response);
                })
                .catch(function (response){
                    authenticated = false;
                    deferred.reject(response);
                });

            return deferred.promise;
        };

        /**
         * @public
         * @method isAuthenticated
         * @return {Boolean} whether the current user is authenticated
         */
        this.isAuthenticated = function isAuthenticated() {
            return authenticated;
        };

        /**
         * Attempt to get the current user object and request authentication
         * if token has expired.
         * @public
         * @method getUser
         * @return {Promise} User object
         */
        this.getUser = function getUser() {
            var deferred = $q.defer();

            if (authenticated){
                getCurrentUser()
                    .then(deferred.resolve)
                    .catch(deferred.reject);
            } else {
                deferred.reject();
            }

            return deferred.promise;
        };

        /**
         * Get Users Playlists
         * @public
         * @method getUserPlaylists
         * @param  {Object}  request options
         * @return {Promise} User playlists object
         */
        this.getUserPlaylists = function getUserPlaylists(options) {
            var deferred = $q.defer();

            _this.getUser()
                .then(function (response){
                    Spotify.getUserPlaylists(response.id, options)
                        .then(deferred.resolve)
                        .catch(deferred.reject);
                })
                .catch(deferred.reject);

            return deferred.promise;
        };

    }
]);
