"use strict";
/**
 * Search for tracks using spotify to
 * add to FM player playlist
 * @module   FM.search
 * @author   SOON_
 * @requires FM.search.SearchCtrl
 * @requires FM.search.ArtistSearchCtrl
 * @requires FM.search.ArtistDetailCtrl
 * @requires FM.search.AlbumSearchCtrl
 * @requires FM.search.AlbumDetailCtrl
 * @requires FM.search.TrackSearchCtrl
 * @requires FM.search.artistDirective
 * @requires FM.search.albumDirective
 */
angular.module("FM.search", [
    "FM.search.SearchCtrl",
    "FM.search.ArtistSearchCtrl",
    "FM.search.ArtistDetailCtrl",
    "FM.search.AlbumSearchCtrl",
    "FM.search.AlbumDetailCtrl",
    "FM.search.TrackSearchCtrl",
    "FM.search.artistDirective",
    "FM.search.albumDirective"
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
