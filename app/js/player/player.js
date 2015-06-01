"use strict";
/**
 * Handles playback and other controls for currently
 * playing track in FM player
 * @module   FM.player
 * @author   SOON_
 * @requires FM.player.PlayerCtrl
 * @requires FM.player.PlayerService
 * @requires FM.player.trackDirective
 */
angular.module("FM.player", [
    "FM.player.PlayerCtrl",
    "FM.player.trackDirective",
    "FM.player.sliderDirective"
]);