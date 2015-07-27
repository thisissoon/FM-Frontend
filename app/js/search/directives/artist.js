"use strict";
/**
 * A directive for the spotify artist object
 * @module FM.search.artistDirective
 * @author SOON_
 */
angular.module("FM.search.artistDirective", [

])
/**
 * @example
    <fm-artist data-artist="artistObj"></fm-artist>
 * @constructor
 * @class fmArtist
 */
.directive("fmArtist", [
    function (){
        return {
            restrict: "EA",
            scope: {
                artist: "="
            },
            templateUrl: "partials/search/artist.html"
        };
    }
]);
