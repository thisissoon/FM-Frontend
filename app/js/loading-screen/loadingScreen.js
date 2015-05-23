"use strict";
/**
 * Implements a loading screen inbetween route changes
 * @module FM.loadingScreen
 * @author SOON_
 */
angular.module("FM.loadingScreen", [

])
/**
 * @constant
 * @property ROUTE_EVENTS
 * @type     {Object}
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
 * @class fmLoadingScreen
 * @constructor
 * @param {Service} $rootScope
 * @param {Object}  ROUTE_EVENTS
 */
.directive("fmLoadingScreen",[
    "$rootScope",
    "ROUTE_EVENTS",
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
                    $element.removeClass("hidden");
                };

                /**
                 * hide the loading screen
                 * @method hide
                 */
                var hide = function hide(){
                    $element.addClass("hidden");
                };

                $rootScope.$on(ROUTE_EVENTS.ROUTE_CHANGE_START, show);
                $rootScope.$on(ROUTE_EVENTS.ROUTE_CHANGE_SUCCESS, hide);
                $rootScope.$on(ROUTE_EVENTS.ROUTE_CHANGE_ERROR, hide);

            }
        };
    }
]);
