"use strict";
/**
 * Configuration for FM API
 * @module sn.fm.api
 * @author SOON_
 */
angular.module("sn.fm.api").config([
    "$httpProvider",
    function ($httpProvider) {

        $httpProvider.defaults.headers.common["Content-Type"] = "application/json; charset=utf-8";

    }


]);
