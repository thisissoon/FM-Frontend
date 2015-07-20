"use strict";
/**
 * @module   FM.stats.StatsCtrl
 * @author   "SOON_"
 */
angular.module("FM.stats.StatsCtrl", [
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
    "$q",
    "$filter",
    "$location",
    "CHART_COLOURS",
    "CHART_OPTIONS",
    "StatsResource",
    "stats",
    function ($scope, $q, $filter, $location, CHART_COLOURS, CHART_OPTIONS, StatsResource, stats) {

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
         * Total number of tracks played
         * @property {Number} totalPlays
         */
        $scope.totalPlays = stats.total_plays;  // jshint ignore:line

        /**
         * Total play time in ms
         * @property {Number} totalPlayTime
         */
        $scope.totalPlayTime = stats.total_play_time;  // jshint ignore:line

        /**
         * List of top 10 tracks
         * @property {Array} topTracks
         */
        $scope.topTracks = stats.most_played_tracks;  // jshint ignore:line

        /**
         * List of top 10 artists
         * @property {Array} topArtists
         */
        $scope.topArtists = stats.most_played_artists;  // jshint ignore:line

        /**
         * List of top 10 genres
         * @property {Array} topGenres
         */
        $scope.topGenres = stats.most_played_genres;  // jshint ignore:line

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

            if (data.length) {

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

            startDate = new Date(startDate);
            endDate = new Date(endDate);

            /**
             * Difference in days between filter start and end dates
             * @property {Number} diff
             */
            var diff = (startDate.getTime() - endDate.getTime()) / (24 * 60 * 60 * 1000);

            /**
             * Calculated dates for historic data, based on filter dates
             * Eg. if the filter period is 1 week this will be 1 week before, 2 weeks before and 3 weeks before
             * @property {Array} dates
             */
            var dates = [{
                from: $filter("date")(new Date().setDate(startDate.getDate() + diff), "yyyy-MM-dd"),
                to: $filter("date")(new Date().setDate(startDate.getDate() + diff - 1), "yyyy-MM-dd"),
            },{
                from: $filter("date")(new Date().setDate(startDate.getDate() + (diff * 2)), "yyyy-MM-dd"),
                to: $filter("date")(new Date().setDate(startDate.getDate() + (diff * 2) - 1), "yyyy-MM-dd"),
            },{
                from: $filter("date")(new Date().setDate(startDate.getDate() + (diff * 3)), "yyyy-MM-dd"),
                to: $filter("date")(new Date().setDate(startDate.getDate() + (diff * 3) - 1), "yyyy-MM-dd"),
            }];


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
            $scope.search = $scope.filter;
            $scope.search.to = $scope.search.to.toISOString ? $filter("date")($scope.search.to.toISOString(), "yyyy-MM-dd") : $scope.search.to;
            $scope.search.from = $scope.search.from.toISOString ? $filter("date")($scope.search.from.toISOString(), "yyyy-MM-dd") : $scope.search.from;
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

            /**
             * Calculate date boundaries of last week
             * @property {Array} lastWeek
             */
            var lastWeek = [new Date(), new Date()];
            lastWeek[0].setDate(lastWeek[0].getDate() - 14);
            lastWeek[1].setDate(lastWeek[1].getDate() - 7);

            // set max datepicker date to be end of last week
            $scope.datepickerMaxDate = lastWeek[1];

            // default filter to last week
            $scope.filter.from = $scope.search.from || lastWeek[0];
            $scope.filter.to = $scope.search.to || lastWeek[1];


            // Format most active DJ stats for charts
            stats.most_active_djs.forEach(function(item, index){  // jshint ignore:line
                if (index < 5) {
                    $scope.activeDj.labels.push(item.user.display_name);  // jshint ignore:line
                    $scope.activeDj.data.push(item.total);
                }
            });

            // Format total play time per user stats for charts
            $scope.addDataToSeries($scope.playTime, stats.total_play_time_per_user, $filter("date")($scope.filter.from, "dd-MM-yyyy"));  // jshint ignore:line
            // Load additional data for play time line chart
            $scope.loadHistoricData($scope.filter.from, $scope.filter.to);
        };

        $scope.init();

    }
]);
