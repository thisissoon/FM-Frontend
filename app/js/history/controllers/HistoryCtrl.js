"use strict";
/**
 * @module   FM.history.HistoryCtrl
 * @author   SOON_
 * @requires FM.api
 * @requires ngRoute
 */
angular.module("FM.history.HistoryCtrl", [
    "FM.api.PlayerHistoryResource",
    "infinite-scroll",
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
                    historyData: ["PlayerHistoryResource", "$q", "$route", function (PlayerHistoryResource, $q, $route){
                        var deferred = $q.defer();

                        // resolve headers from query
                        PlayerHistoryResource.query($route.current.params, function(response, headers){
                            deferred.resolve({
                                data: response,
                                headers: headers
                            });
                        }, function(response, headers) {
                            deferred.resolve({
                                data: response,
                                headers: headers
                            });
                        });

                        return deferred.promise;
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
        $scope.history = historyData.data;

        /**
         * Paging properties
         * @property {Object} page
         */
        $scope.page = {
            loading: false,
            pages: 1,
            total: historyData.headers("Total-Pages")
        };

        /**
         * Load more track history
         * @method loadMore
         */
        $scope.loadMore = function loadMore () {

            $scope.page.loading = true;
            $scope.page.pages++;

            PlayerHistoryResource.query({ page: $scope.page.pages },
                function(response, headers){
                    $scope.history = $scope.history.concat(response);

                    $scope.page.loading = false;
                    $scope.page.total = headers("Total-Pages") || 0;
                });
        };

    }
]);