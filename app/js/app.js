"use strict";
/**
 * Search for tracks on spotify and request tracks to be played
 * on thisissoon.fm
 * @module   sn.fm
 * @main     sn.fm
 * @author   SOON_
 */
angular.module("sn.fm", ["ngMaterial", "sn.fm.api", "sn.fm.player", "sn.fm.sockets"])

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
            $mdSidenav(menuId).toggle();
        };
    }
]);
