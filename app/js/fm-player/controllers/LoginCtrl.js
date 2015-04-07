"use strict";
/**
 * Controller for thisissoon FM authentication actions
 * @class  LoginCtrl
 * @module sn.fm.player
 * @author SOON_
 */
angular.module("sn.fm.player").controller("LoginCtrl", [
    "$scope",
    "$route",
    "$auth",
    "$mdDialog",
    "ERRORS",
    /**
     * @constructor
     * @param {Object}  $scope
     * @param {Service} $route
     * @param {Service} $auth     satellizer $auth service
     * @param {Service} $mdDialog angular material dialog service
     * @param {Object}  ERRORS    error message copy
     */
    function ($scope, $route, $auth, $mdDialog, ERRORS) {

        /**
         * Authenticate with google oauth
         * @method authenticate
         */
        $scope.authenticate = function() {

            $auth.authenticate("google")
                .then(function() {
                    $route.reload();
                })
                .catch(function(error){
                    // Satellizer returns an error if there is no token, parse the error to get the original API response
                    var response = JSON.parse(error.message.match(/\{.*\}/));

                    if (response && response.message === "Validation Error") {
                        $scope.showAlert(ERRORS.AUTH_VALIDATION_TITLE, response.errors.code[0]);
                    }

                    $auth.removeToken();
                });

        };

        /**
         * Show alert dialog with mdDialog service
         * @param {String} title   title to display in dialog
         * @param {String} content content to display in dialog
         */
        $scope.showAlert = function showAlert(title, content) {
            $mdDialog.show(
                $mdDialog.alert()
                    .title(title)
                    .content(content)
                    .ariaLabel("Alert")
                    .ok("Ok")
            );
        };

    }

]);
