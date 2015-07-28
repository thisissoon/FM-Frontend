"use strict";
/**
 * A directive for the spotify album object
 * @module FM.search.albumDirective
 * @author SOON_
 */
angular.module("FM.search.albumDirective", [

])
/**
 * @example
    <fm-album data-album="albumObj"></fm-album>
 * @constructor
 * @class fmAlbum
 */
.directive("fmAlbum", [
    function (){
        return {
            restrict: "EA",
            scope: {
                album: "="
            },
            templateUrl: "partials/search/album.html"
        };
    }
]);
