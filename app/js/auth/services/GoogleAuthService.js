"use strict";
/**
 * Authentication service for google login
 * @module FM.auth.GoogleAuthService
 * @author SOON_
 */
angular.module("FM.auth.GoogleAuthService", [
    "FM.api.UsersResource",
    "satellizer"
])
/**
 * @class GoogleAuthService
 * @param {Service} $q
 * @param {Factory} UsersResource
 */
.service("GoogleAuthService", [
    "$rootScope",
    "$q",
    "$auth",
    "UsersResource",
    function ($rootScope, $q, $auth, UsersResource){

        /**
         * @private
         * @property user
         * @type {Object}
         */
        var user = null;

        /**
         * @public
         * @method loadUser
         * @return {Promise} The current user object
         */
        this.loadUser = function loadUser() {
            var deferred = $q.defer();

            UsersResource.current().$promise
                .then(function (response) {
                    user = response;
                    deferred.resolve(response);
                })
                .catch(deferred.reject);

            return deferred.promise;
        };

        /**
         * @public
         * @method getUser
         * @return {Object} The current user object
         */
        this.getUser = function getUser() {
            return user;
        };

    }
]);
