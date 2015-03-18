"use strict";
/**
 * An instance of a song for the fm.player, data format
 * is the same as from the spotitfy api.
 * @example
    <fm-track spotify-track="mySpotifyTrackObject"></fm-track>
 * @class  fmTrack
 * @module sn.fm.player
 * @author SOON_
 */
angular.module("sn.fm.player").directive("fmTrack",[
    /**
     * @constructor
     */
    function (){
        return {
            restrict: "EA",
            scope: {
                track: "=spotifyTrack",
                controls: "="
            },
            templateUrl: "partials/track.html"
        };
    }
]);
