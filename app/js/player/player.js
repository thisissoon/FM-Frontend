"use strict";
/**
 * Handles playback and other controls for currently
 * playing track in FM player
 * @module   FM.player
 * @author   SOON_
 * @requires FM.player.PlayerCtrl
 * @requires FM.player.trackDirective
 * @requires FM.player.sliderDirective
 * @requires FM.player.TrackTimer
 * @requires FM.player.removeLeadingZeros
 */
angular.module("FM.player", [
    "FM.player.PlayerCtrl",
    "FM.player.trackDirective",
    "FM.player.sliderDirective",
    "FM.player.TrackTimer",
    "FM.player.removeLeadingZeros"
]);
