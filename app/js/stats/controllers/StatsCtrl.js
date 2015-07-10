"use strict";
/**
 * @module   FM.stats.StatsCtrl
 * @author   "SOON_"
 */
angular.module("FM.stats.StatsCtrl", [
    "FM.api.StatsResource",
    "ngRoute",
    "chart.js"
])
/**
 * @method config
 * @param  {Provider} $routeProvider
 */
.config([
    "$routeProvider",
    function ($routeProvider) {

        $routeProvider
            .when("/stats", {
                templateUrl: "partials/stats.html",
                controller: "StatsCtrl",
                resolve: {
                    stats: ["StatsResource", "$route", function (StatsResource, $route){
                        return StatsResource.get($route.current.params).$promise;
                    }]
                }
            });

    }
])
/**
 * @constructor
 * @param {Object} $scope Application data on scope
 * @param {Object} stats  Data resolved from API
 */
.controller("StatsCtrl", [
    "$scope",
    "stats",
    function ($scope, stats) {


    }
]);
