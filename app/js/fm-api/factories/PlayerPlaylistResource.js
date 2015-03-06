"use strict";
/**
 * Factory which provides actions to perform on /player/playlist endpoint
 */
angular.module("sn.fm.api").factory("PlayerPlaylistResource", [
    "$resource",
    "SERVER_ADDRESS",
    /**
     * @constructor
     * @param   {Service}  $resource angular resource service xhr wrapper for REST api's
     * @param   {String}   SERVER_ADDRESS    API server url
     */
    function ($resource, SERVER_ADDRESS) {

        return $resource(SERVER_ADDRESS + "player/playlist");

    }
]);
