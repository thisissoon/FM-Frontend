"use strict";
/**
 * An instance of a song for the FM.player.
 * Data format is the same as from the spotitfy api.
 * @module FM.player.trackDirective
 * @author SOON_
 */
angular.module("FM.player.trackDirective", [
    "ui.bootstrap.popover",
    "template/popover/popover-template.html",
    "template/popover/popover.html"
])
/**
 * @example
    <fm-track spotify-track="mySpotifyTrackObject"></fm-track>
 * @constructor
 * @class fmTrack
 */
.directive("fmTrack",[
    function (){
        return {
            restrict: "EA",
            scope: {
                track: "=spotifyTrack",
                current: "=",
                user: "=",
                timer: "=?"
            },
            templateUrl: "partials/track.html"
        };
    }
]);
