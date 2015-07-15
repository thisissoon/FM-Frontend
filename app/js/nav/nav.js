"use strict";
/**
 * @module   FM.nav
 * @author   SOON_
 */
angular.module("FM.nav", [

])

.run([
    "$rootScope",
    "$location",
    function ($rootScope, $location) {

        /**
         * Get the current path from $route service
         * @method routeIsActive
         * @return {String} The current location path
         */
        $rootScope.routeIsActive = function routeIsActive(path){
            return path === $location.path();
        };

    }
]);
