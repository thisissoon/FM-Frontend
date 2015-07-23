"use strict";
/**
 * Controller to handle Spotify Login
 * @class  LoginSpotifyCtrl
 * @module FM.auth.LoginSpotifyCtrl
 * @author SOON_
 */
angular.module("FM.auth.LoginSpotifyCtrl", [
    "FM.alert",
    "spotify",
    "satellizer",
    "FM.api.ERRORS",
    "config",
])
/**
 * @constructor
 * @class LoginSpotifyCtrl
 * @param {Object}  $scope
 * @param {Service} $window
 * @param {Object}  ERRORS
 * @param {Service} Spotify
 * @param {Object}  AlertService
 */
.controller("LoginSpotifyCtrl", [
    "$scope",
    "$window",
    "ERRORS",
    "Spotify",
    "AlertService",
    function ($scope, $window, ERRORS, Spotify, AlertService) {

        /**
         * Authenticate with google oauth
         * @method authenticate
         */
        $scope.authenticate = function authenticate() {
            Spotify.login()
                .then(function (response){
                    Spotify.setAuthToken(response);
                })
                .catch(function (error){
                    // Satellizer returns an error if there is no token, parse the error to get the original API response
                    var response = JSON.parse(error.message.match(/\{.*\}/));

                    if (response && response.message === "Validation Error") {
                        AlertService.set(ERRORS.AUTH_VALIDATION_TITLE, response.errors.code[0]);
                    }

                    $window.localStorage.removeItem("spotify-token");
                });
        };

    }

]);
