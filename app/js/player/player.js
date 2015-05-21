"use strict";
/**
 * Main thisissoon FM player module which allows the user to search tracks
 * using spotify and add them to the playlist as well as viewing the current
 * thisissoon FM playlist
 * @module   FM.player
 * @main     FM.player
 * @author   SOON_
 * @requires ngRoute    {@link https://docs.angularjs.org/api/ngRoute}
 * @requires spotify    {@link https://github.com/eddiemoore/angular-spotify}
 * @requires sn.fm.api
 */
angular.module("FM.player", [
    "FM.player.PlayerCtrl",
    "ENV",
    "ngRoute",
    "spotify",
    "satellizer",
    "sn.fm.api"
])
.run([
    "$rootScope",
    "$auth",
    function ($rootScope, $auth){

        /**
         * Set isAuthenticated if token exists
         * @returns {Boolean} user is authenticated
         */
        $rootScope.isAuthenticated = function isAuthenticated() {
            return Boolean($auth.getToken());
        };

        $rootScope.$on("$routeChangeStart", function(){
            $rootScope.routeChanging = true;
        });
        $rootScope.$on("$routeChangeSuccess", function(){
            $rootScope.routeChanging = false;
        });
        $rootScope.$on("$routeChangeError", function(){
            $rootScope.routeChanging = false;
        });

    }
]);
