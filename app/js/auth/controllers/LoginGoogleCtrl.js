"use strict";
/**
 * Controller for thisissoon FM authentication actions
 * @class  LoginGoogleCtrl
 * @module FM.auth.LoginGoogleCtrl
 * @author SOON_
 */
angular.module("FM.auth.LoginGoogleCtrl", [
    "FM.auth.GoogleAuthService",
    "FM.alert",
    "satellizer",
    "FM.api.ERRORS"
])
/**
 * @class  LoginGoogleCtrl
 * @author SOON_
 */
.controller("LoginGoogleCtrl", [
    "$scope",
    "$route",
    "$auth",
    "ERRORS",
    "AlertService",
    "GoogleAuthService",
    /**
     * @constructor
     * @param {Object}  $scope
     * @param {Service} $route
     * @param {Service} $auth             satellizer $auth service
     * @param {Object}  ERRORS            error message copy
     * @param {Object}  AlertService      Service which displays errors in the player
     * @param {Object}  GoogleAuthService Stores google auth data
     */
    function ($scope, $route, $auth, ERRORS, AlertService, GoogleAuthService) {

        /**
         * Authenticate with google oauth
         * @method authenticate
         */
        $scope.authenticate = function authenticate() {

            $auth.authenticate("google")
                .then(function(){
                    GoogleAuthService.loadUser();
                    $route.reload();
                })
                .catch(function (error){
                    // Satellizer returns an error if there is no token, parse the error to get the original API response
                    var response = JSON.parse(error.message.match(/\{.*\}/));

                    if (response && response.message === "Validation Error") {
                        AlertService.set(ERRORS.AUTH_VALIDATION_TITLE, response.errors.code[0]);
                    }

                    $auth.removeToken();
                });
        };

    }

]);
