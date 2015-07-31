"use strict";
/**
 * A directive for the spotify playlist object
 * @module FM.search.playlistDirective
 * @author SOON_
 */
angular.module("FM.search.playlistDirective", [

])
/**
 * @example
    <fm-playlist data-playlist="playlistObj"></fm-playlist>
 * @constructor
 * @class fmPlaylist
 */
.directive("fmPlaylist", [
    function (){
        return {
            restrict: "EA",
            scope: {
                playlist: "="
            },
            templateUrl: "partials/search/playlist.html"
        };
    }
]);
