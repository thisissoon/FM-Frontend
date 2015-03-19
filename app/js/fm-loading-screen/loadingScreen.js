"use strict";
/**
 * Implements a loading screen inbetween route changes
 * @module sn.fm.loadingScreen
 * @author SOON_
 */
angular.module("sn.fm.loadingScreen", [])
/**
 * @constant
 * @property ROUTE_EVENTS
 * @type {Object}
 */
.constant("ROUTE_EVENTS", {
    ROUTE_CHANGE_START: "$routeChangeStart",
    ROUTE_CHANGE_SUCCESS: "$routeChangeSuccess",
    ROUTE_CHANGE_ERROR: "$routeChangeError"
})
/**
 * Angular directive for a progress bar
 * @example
    <fm-loading-screen></fm-loading-screen>
 * @class  fmLoadingScreen
 * @module sn.fm.loadingScreen
 * @author SOON_
 */
.directive("fmLoadingScreen",[
    "$rootScope",
    "ROUTE_EVENTS",
    /**
     * @constructor
     * @param {Service} $rootScope
     * @param {Object}  ROUTE_EVENTS
     */
    function ($rootScope, ROUTE_EVENTS){
        return {
            restrict: "EA",
            templateUrl: "partials/loading.html",
            link: function ($scope, $element){

                /**
                 * display the loading screen
                 * @method show
                 */
                var show = function show(){
                    $element.removeClass("hide");
                };

                /**
                 * hide the loading screen
                 * @method show
                 */
                var hide = function hide(){
                    $element.addClass("hide");
                };

                $rootScope.$on(ROUTE_EVENTS.ROUTE_CHANGE_START, show);
                $rootScope.$on(ROUTE_EVENTS.ROUTE_CHANGE_SUCCESS, hide);
                $rootScope.$on(ROUTE_EVENTS.ROUTE_CHANGE_ERROR, hide);

            }
        };
    }
]);
