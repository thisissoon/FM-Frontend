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
 * @method run
 * @param  {Service} SpotifyAuth
 */
.run([
    "SpotifyAuth",
    function (SpotifyAuth){
        SpotifyAuth.init();
    }
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
         * @public
         * @property {Object} user
         */
        this.user = null;

        /**
         * Whether the user is authenticated
         * @public
         * @property {Object} authenticated
         */
        this.authenticated = false;

        /**
         * @public
         * @method isAuthenticated
         * @return {Boolean} whether the current user is authenticated
         */
        this.isAuthenticated = function isAuthenticated() {
            return _this.authenticated;
        };

        /**
         * Authenticate with spotify OAuth
         * @method authenticate
         * @return {Object} Spotify user object
         */
        this.authenticate = function authenticate() {
            var deferred = $q.defer();

            Spotify.login()
                .then(function (response){
                    if (response && typeof response === "string"){
                        Spotify.setAuthToken(response);
                        $window.localStorage.setItem(TOKEN_NAME, response);
                        _this.authenticated = true;
                        deferred.resolve(response);
                    } else {
                        AlertService.set(ERRORS.AUTH_VALIDATION_TITLE, response.error.status);
                        _this.authenticated = false;
                        $window.localStorage.removeItem(TOKEN_NAME);
                        deferred.reject(response);
                    }
                });

            return deferred.promise;
        };

        /**
         * @method getCurrentUser
         * @return {Object} current spotify user object
         */
        this.getCurrentUser = function getCurrentUser(){
            var deferred = $q.defer();

            Spotify.getCurrentUser()
                .then(function (response){
                    _this.user = response;
                    _this.authenticated = true;
                    deferred.resolve(response);
                })
                .catch(function (response){
                    _this.user = null;
                    _this.authenticated = false;
                    deferred.reject(response);
                });

            return deferred.promise;
        };

        /**
         * Attempt to authenicate the user if
         * they have logged into spotify before
         * @public
         * @method init
         */
        this.init = function init() {
            var authToken = $window.localStorage.getItem(TOKEN_NAME);
            if (authToken){
                Spotify.setAuthToken(authToken);
                _this.getCurrentUser()
                    .then(function (response){
                        if (response && response.error && response.error.status === 401){
                            _this.authenticate();
                        }
                    });
            }
        };

    }
]);
