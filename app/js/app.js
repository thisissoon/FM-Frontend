"use strict";
/**
 * Searches for tracks using spotify and sends track uri data to
 * thisissoon FM API to add to the thisissoon FM player playlist
 * @module   sn.fm
 * @main     sn.fm
 * @author   SOON_
 * @requires sn.fm.player Main FM player module that displays tracks
 */
angular.module("sn.fm", ["sn.fm.player", "sn.fm.sockets", "sn.fm.loadingScreen"]);
