"use strict";
/**
 * @module   FM.users.UserStatsCtrl
 * @author   SOON_
 */
angular.module("FM.users.UserStatsCtrl", [
    "FM.api.UsersResource",
    "FM.stats",
    "ngRoute",
    "chart.js",
    "ui.bootstrap.datepicker"
])
/**
 * @method config
 * @param  {Provider} $routeProvider
 */
.config([
    "$routeProvider",
    function ($routeProvider) {

        $routeProvider
            .when("/users/:id", {
                templateUrl: "partials/users/stats.html",
                controller: "UserStatsCtrl",
                resolve: {
                    stats: ["statsResolver", "$route", "UsersResource", function (statsResolver, $route, UsersResource) {
                        return statsResolver(UsersResource.stats, $route.current.params);
                    }],
                    user: ["UsersResource", "$route", function (UsersResource, $route){
                        return UsersResource.get($route.current.params).$promise;
                    }]
                }
            });

    }
])
/**
 * @constructor
 * @class UserStatsCtrl
 * @param {Object}   $scope        Scoped application data
 * @param {Service}  $q            Angular promise service
 * @param {Service}  $filter       Angular filter service
 * @param {Service}  $location     Angular URL service
 * @param {Service}  DateUtils     Date helper functions
 * @param {Array}    CHART_COLOURS List of global chart colours
 * @param {Object}   CHART_OPTIONS ChartJS config options
 * @param {Resource} StatsResource Provides communication with stats API endpoint
 * @param {Object}   stats         User's stats resolved from API
 * @param {Object}   user          User object resolved from API
 */
.controller("UserStatsCtrl", [
    "$scope",
    "$q",
    "$filter",
    "$location",
    "DateUtils",
    "CHART_COLOURS",
    "CHART_OPTIONS",
    "UsersResource",
    "stats",
    "user",
    function ($scope, $q, $filter, $location, DateUtils, CHART_COLOURS, CHART_OPTIONS, UsersResource, stats, user) {

        /**
         * User
         * @property {Object} user
         */
        $scope.user = user;

        /**
         * User's stats resolved from API
         * @property {Object} stats
         */
        $scope.stats = stats;

        /**
         * Current search params
         * @property {Object} search
         */
        $scope.search = $location.search();

        /**
         * @property {Object} filter
         */
        $scope.filter = {};

        /**
         * Track open status of datepickers
         * @property {Object} datepickerOpened
         */
        $scope.datepickerOpened = {
            from: "",
            to: ""
        };

        /**
         * List of colours to use for charts
         * @property {Array} chartColours
         */
        $scope.chartColours = CHART_COLOURS;

        /**
         * ChartJS config for play time line graph
         * @property {Object} playTime
         */
        $scope.playTime = {
            data: [[]],
            series: [user.display_name],  // jshint ignore:line
            labels: [],
            options: CHART_OPTIONS
        };

        /**
         * Load historic play time statistics for line chart based on filter start/end dates
         * @method loadHistoricData
         * @param {String} startDate Filter start date
         * @param {String} endDate   Filter end date
         */
        $scope.loadHistoricData = function loadHistoricData (startDate, endDate) {

            var dates = DateUtils.historicDatePeriods(startDate, endDate, 3);

            // request historic data from API using calculated date ranges
            $q.all([
                UsersResource.stats({ from: dates[0].from, to: dates[0].to, id: user.id }).$promise,
                UsersResource.stats({ from: dates[1].from, to: dates[1].to, id: user.id }).$promise,
                UsersResource.stats({ from: dates[2].from, to: dates[2].to, id: user.id }).$promise
            ]).then(function (responses) {
                responses.forEach(function (response, index) {
                    // add data to play time chart dataset
                    $scope.playTime.labels.unshift($filter("date")(dates[index].from, "dd-MM-yyyy"));
                    // convert milliseconds to minutes
                    $scope.playTime.data[0].unshift(Math.round(response.total_play_time / 1000 / 60));  // jshint ignore:line
                });
            });
        };

        /**
         * Filter stats by dates
         * @method updateFilter
         */
        $scope.updateFilter = function updateFilter () {
            if ($scope.filter.to) {
                $scope.search.to = $scope.filter.to.toISOString ? $filter("date")($scope.filter.to.toISOString(), "yyyy-MM-dd") : $scope.filter.to;
            } else {
                $scope.search.to = undefined;
            }
            if ($scope.filter.from) {
                $scope.search.from = $scope.filter.from.toISOString ? $filter("date")($scope.filter.from.toISOString(), "yyyy-MM-dd") : $scope.filter.from;
            } else {
                $scope.search.from = undefined;
                $scope.search.all = true;
            }
            $location.search($scope.search);
        };

        /**
         * Open datepicker
         * @method updateFilter
         */
        $scope.openDatepicker = function openDatepicker($event, id) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.datepickerOpened[id] = !$scope.datepickerOpened[id] ;
        };

        /**
         * Set current filter params and load historic data on initalise
         * @method init
         */
        $scope.init = function init () {

            $scope.filter.from = $scope.search.from || undefined;
            $scope.filter.to = $scope.search.to || undefined;

            // set max datepicker date to today
            $scope.datepickerMaxDate = new Date();

            if ($scope.filter.from) {
                // Format total play time per user stats for charts
                $scope.playTime.labels.unshift($filter("date")($scope.filter.from, "dd-MM-yyyy"));
                // convert milliseconds to minutes
                $scope.playTime.data[0].unshift(Math.round(stats.total_play_time / 1000 / 60));  // jshint ignore:line

                // Load additional data for play time line chart
                $scope.loadHistoricData($scope.filter.from, $scope.filter.to);
            }
        };

        $scope.init();

    }
]);
