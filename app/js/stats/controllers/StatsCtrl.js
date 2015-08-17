"use strict";
/**
 * @module   FM.stats.StatsCtrl
 * @author   "SOON_"
 */
angular.module("FM.stats.StatsCtrl", [
    "FM.stats.DateUtils",
    "FM.stats.statsResolver",
    "FM.api.StatsResource",
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
            .when("/stats", {
                templateUrl: "partials/stats.html",
                controller: "StatsCtrl",
                resolve: {
                    stats: ["statsResolver", "$route", "StatsResource", function (statsResolver, $route, StatsResource) {
                        return statsResolver(StatsResource.get, $route.current.params);
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
    "$q",
    "$filter",
    "$location",
    "CHART_COLOURS",
    "CHART_OPTIONS",
    "DateUtils",
    "StatsResource",
    "stats",
    function ($scope, $q, $filter, $location, CHART_COLOURS, CHART_OPTIONS, DateUtils, StatsResource, stats) {

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
         * Stats resolved from the API
         * @property {Object} stats
         */
        $scope.stats = stats;

        /**
         * List of colours to use for charts
         * @property {Array} chartColours
         */
        $scope.chartColours = CHART_COLOURS;

        /**
         * ChartJS config for active DJs pie chart
         * @property {Object} activeDj
         */
        $scope.activeDj = {
            labels: [],
            data: [],
            options: CHART_OPTIONS
        };

        /**
         * ChartJS config for play time line graph
         * @property {Object} playTime
         */
        $scope.playTime = {
            options: CHART_OPTIONS
        };

        /**
         * Format series based stats data for chart and add to existing dataset
         * @method addDataToSeries
         * @param {Object} dataset   ChartJs config object
         * @param {Object} data      New stat data from API
         * @param {String} label     Label for dataset
         * @param {Number} maxSeries Maximum number of series to extract from data
         */
        $scope.addDataToSeries = function addDataToSeries (dataset, data, label, maxSeries) {

            // initalise dataset properties
            dataset.labels = dataset.labels || [];
            dataset.data = dataset.data || [];
            dataset.series = dataset.series || [];

            // default maximum series length to 5
            maxSeries = maxSeries || 5;

            if (data && data.length) {

                // add dataset label
                dataset.labels.unshift(label);

                // parse data from API to chart data array
                data.forEach(function(item, index){
                    if (index < maxSeries) {
                        dataset.data[index] = dataset.data[index] || [];
                        dataset.series[index] = item.user.display_name;  // jshint ignore:line
                        // convert milliseconds to minutes
                        dataset.data[index].unshift(Math.round(item.total/1000/60));
                    }
                });
            }
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
                StatsResource.get(dates[0]).$promise,
                StatsResource.get(dates[1]).$promise,
                StatsResource.get(dates[2]).$promise
            ]).then(function (responses) {
                responses.forEach(function (response, index) {
                    // add data to play time chart dataset
                    $scope.addDataToSeries($scope.playTime, response.total_play_time_per_user, $filter("date")(dates[index].from, "dd-MM-yyyy"));  // jshint ignore:line
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

            // set max datepicker date to be end of last week
            $scope.datepickerMaxDate = DateUtils.lastOccurence(5);

            // Format most active DJ stats for charts
            if (stats.most_active_djs) {  // jshint ignore:line
                stats.most_active_djs.forEach(function(item, index){  // jshint ignore:line
                    if (index < 5) {
                        $scope.activeDj.labels.push(item.user.display_name);  // jshint ignore:line
                        $scope.activeDj.data.push(item.total);
                    }
                });
            }

            if ($scope.filter.from) {
                // Format total play time per user stats for charts
                $scope.addDataToSeries($scope.playTime, stats.total_play_time_per_user, $filter("date")($scope.filter.from, "dd-MM-yyyy"));  // jshint ignore:line
                // Load additional data for play time line chart
                $scope.loadHistoricData($scope.filter.from, $scope.filter.to);
            }
        };

        $scope.init();

    }
]);
