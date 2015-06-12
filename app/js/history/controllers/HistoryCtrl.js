"use strict";
/**
 * @module   FM.history.HistoryCtrl
 * @author   SOON_
 * @requires FM.api
 * @requires ngRoute
 */
angular.module("FM.history.HistoryCtrl", [
    "FM.api.PlayerHistoryResource",
    "sn.infiniteScroll",
    "ngRoute"
])
/**
 * @method config
 * @param  {Provider} $routeProvider
 */
.config([
    "$routeProvider",
    function ($routeProvider) {

        $routeProvider
            .when("/history", {
                templateUrl: "partials/history.html",
                controller: "HistoryCtrl",
                resolve: {
                    historyData: ["PlayerHistoryResource", "$route", function (PlayerHistoryResource, $route){
                        return PlayerHistoryResource.query($route.current.params);
                    }]
                }
            });

    }
])
/**
 * @constructor
 * @class HistoryCtrl
 * @param {Object} $scope
 * @param {Array}  historyData
 */
.controller("HistoryCtrl", [
    "$scope",
    "PlayerHistoryResource",
    "historyData",
    function ($scope, PlayerHistoryResource, historyData) {

        /**
         * @property history
         * @type {Array}
         */
        $scope.history = historyData;

        /**
         * Paging properties
         * @property {Object} page
         */
        $scope.page = {
            loading: false,
            pages: 1,
            total: historyData.meta.totalPages
        };

        /**
         * Load more track history
         * @method loadMore
         */
        $scope.loadMore = function loadMore () {

            $scope.page.loading = true;
            $scope.page.pages++;

            PlayerHistoryResource.query({ page: $scope.page.pages }).$promise
                .then(function(response){
                    $scope.history = $scope.history.concat(response);

                    $scope.page.loading = false;
                    $scope.page.total = response.meta.totalPages || 0;
                });
        };

    }
]);
