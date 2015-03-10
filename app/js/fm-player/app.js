"use strict";
/**
 * Main thisissoon FM player module which allows the user to search tracks
 * using spotify and add them to the playlist as well as viewing the current
 * thisissoon FM playlist
 * @module   sn.fm.player
 * @main     sn.fm.player
 * @author   SOON_
 * @requires ngRoute   {@link https://docs.angularjs.org/api/ngRoute}
 * @requires spotify   {@link https://github.com/eddiemoore/angular-spotify}
 * @requires sn.fm.api
 */
angular.module("sn.fm.player", ["ngRoute", "spotify", "sn.fm.api", "sn.fm.sockets"])

    .run([
        "fmSocketInit",
        function (fmSocketInit) {
            fmSocketInit.forward();
        }
    ]);
