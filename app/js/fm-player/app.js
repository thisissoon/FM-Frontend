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
angular.module("sn.fm.player", ["ENV", "ngRoute", "ngMaterial", "spotify", "satellizer", "sn.fm.api"])

.run([
    "$rootScope",
    "$mdSidenav",
    "$auth",
    function ($rootScope, $mdSidenav, $auth){

        /**
         * Toggles the state of the sidebar
         * @method toggleSideNav
         * @param  {String} menuId
         */
        $rootScope.toggleSideNav = function toggleSideNav(menuId){
            return $mdSidenav(menuId).toggle();
        };

        /**
         * Open side nav bar
         * @method openSideNav
         * @param  {String} menuId
         */
        $rootScope.openSideNav = function openSideNav(menuId){
            return $mdSidenav(menuId).open();
        };

        /**
         * Close side nav bar
         * @method closeSideNav
         * @param  {String} menuId
         */
        $rootScope.closeSideNav = function closeSideNav(menuId){
            return $mdSidenav(menuId).close();
        };

        /**
         * Set isAuthenticated if token exists
         * @returns {Boolean} user is authenticated
         */
        $rootScope.isAuthenticated = function() {
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
