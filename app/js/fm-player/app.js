"use strict";
/**
 * Main thisissoon FM player module which allows the user to search tracks
 * using spotify and add them to the playlist as well as viewing the current
 * thisissoon FM playlist
 * @module   sn.fm.player
 * @main     sn.fm.player
 * @author   SOON_
 * @requires ngRoute    {@link https://docs.angularjs.org/api/ngRoute}
 * @requires ngMaterial {@link https://material.angularjs.org/}
 * @requires spotify    {@link https://github.com/eddiemoore/angular-spotify}
 * @requires sn.fm.api
 */
angular.module("sn.fm.player", ["ngRoute", "ngMaterial", "spotify", "sn.fm.api"])

.run([
    "$rootScope",
    "$mdSidenav",
    function ($rootScope, $mdSidenav){

        /**
         * Toggles the state of the sidebar
         * @method toggleSidenav
         * @param {String} menuId
         */
        $rootScope.toggleSidenav = function toggleSidenav(menuId){
            return $mdSidenav(menuId).toggle();
        };

    }
]);
