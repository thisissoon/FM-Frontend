"use strict";
/**
 * Controller for thisissoon FM authentication actions
 * @class  LoginCtrl
 * @module sn.fm.player
 * @author SOON_
 */
angular.module("sn.fm.player").controller("LoginCtrl", [
    "$scope",
    "$rootScope",
    "$auth",
    "$route",
    /**
     * @constructor
     * @param {Object}  $scope
     * @param {Object}  $rootScope
     * @param {Service} $auth      satellizer $auth service
     */
    function ($scope, $rootScope, $auth, $route) {

        /**
         * Authenticate with google oauth
         * @method authenticate
         */
        $scope.authenticate = function() {

            $auth.authenticate("google").then(function(response) {
                if (response.data.access_token) {
                    $route.reload();
                } else {
                    $auth.removeToken();
                }
            });

        };

    }

]);
