"use strict";
/**
 * An instance of a song for the fm.player, data format
 * is the same as from the spotitfy api.
 * @example
    <fm-track spotify-track="mySpotifyTrackObject"></fm-track>
 * @class  fmTrack
 * @module FM.player
 * @author SOON_
 */
angular.module("FM.player").directive("fmTrack",[
    /**
     * @constructor
     */
    function (){
        return {
            restrict: "EA",
            scope: {
                track: "=spotifyTrack",
                current: "=",
                user: "="
            },
            templateUrl: "partials/track.html"
        };
    }
]);
