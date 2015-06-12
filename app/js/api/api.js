"use strict";
/**
 * Communicates with FM API to add tracks to
 * the playlist and view the current playlist.
 * @module   FM.api
 * @author   SOON_
 */
angular.module("FM.api", [
    "FM.api.PlayerMuteResource",
    "FM.api.PlayerQueueResource",
    "FM.api.PlayerRandomResource",
    "FM.api.PlayerTransportResource",
    "FM.api.PlayerVolumeResource",
    "FM.api.TracksResource",
    "FM.api.UsersResource",
    "FM.api.RequestInterceptor",
    "FM.api.ERRORS"
])
/**
 * @method config
 * @param {Service} $httpProvider
 */
.config([
    "$httpProvider",
    function ($httpProvider) {

        $httpProvider.defaults.headers.common["Content-Type"] = "application/json; charset=utf-8";

    }
]);
