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
         * @public
         * @method isAuthenticated
         * @return {Boolean} whether the current user is authenticated
         */
        this.isAuthenticated = function isAuthenticated() {
            return _this.user;
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
                    Spotify.setAuthToken(response);
                    $window.localStorage.setItem(TOKEN_NAME, response);

                    deferred.resolve(response);
                })
                .catch(function (response){

                    if (response && response.message === "Validation Error") {
                        AlertService.set(ERRORS.AUTH_VALIDATION_TITLE, response.errors.code[0]);
                    }

                    $window.localStorage.removeItem(TOKEN_NAME);

                    deferred.reject(response);
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
                    deferred.resolve(response);
                })
                .catch(function (){
                    _this.authenticate()
                        .then(function(){

                            Spotify.getCurrentUser()
                                .then(function (response){
                                    _this.user = response;
                                    deferred.resolve(response);
                                })
                                .catch(function (response){
                                    _this.user = null;
                                    deferred.reject(response);
                                });

                        })
                        .catch(function (response){
                            _this.user = null;
                            deferred.reject(response);
                        });
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
                _this.getCurrentUser();
            }
        };

    }
]);
