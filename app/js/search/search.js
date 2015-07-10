"use strict";
/**
 * Search for tracks using spotify to
 * add to FM player playlist
 * @module   FM.search
 * @author   SOON_
 * @requires FM.search.SearchCtrl
 */
angular.module("FM.search", [
    "FM.search.SearchCtrl",
    "FM.search.ArtistSearchCtrl",
    "FM.search.ArtistDetailCtrl",
    "FM.search.AlbumSearchCtrl",
    "FM.search.AlbumDetailCtrl",
    "FM.search.PlaylistSearchCtrl"
])
/**
 * @method run
 * @param  $rootScope
 */
.run([
    "$rootScope",
    function ($rootScope) {

        /**
         * @property sidebarOpen
         * @type {Boolean}
         */
        $rootScope.sidebarOpen = false;

        /**
         * Changes the state of the sidebar
         * @method toogleSidebar
         */
        $rootScope.toogleSidebar = function toogleSidebar(){
            $rootScope.sidebarOpen = !$rootScope.sidebarOpen;
        };

    }
]);
