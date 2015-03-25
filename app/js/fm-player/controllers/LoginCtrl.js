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
    /**
     * @constructor
     * @param {Object}   $scope
     * @param {Service}  $route
     * @param {Service}  $auth  satellizer $auth service
     */
    function ($scope, $route, $auth) {

        /**
         * Authenticate with google oauth
         * @method authenticate
         */
        $scope.authenticate = function() {

            $auth.authenticate("google").then(function(response) {
                if (response.data.access_token) { // jshint ignore:line
                    $route.reload();
                } else {
                    $auth.removeToken();
                }
            });

        };

    }

]);
