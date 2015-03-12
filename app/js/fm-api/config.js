"use strict";
/**
 * Configure angular services to the requirements
 * of sn.fm.api angular module such as $httpProvider
 * @module sn.fm.api
 * @author SOON_
 */
angular.module("sn.fm.api").config([
    "$httpProvider",
    function ($httpProvider) {

        $httpProvider.defaults.headers.common["Content-Type"] = "application/json; charset=utf-8";
        $httpProvider.interceptors.push("RequestInterceptor");

    }


]);
