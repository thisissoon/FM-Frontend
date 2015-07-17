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
    "$q",
    "$filter",
    "$location",
    "CHART_COLOURS",
    "StatsResource",
    "stats",
    function ($scope, $q, $filter, $location, CHART_COLOURS, StatsResource, stats) {

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
            options: {
                segmentShowStroke : false,
                animationEasing : "easeInOutQuart",
            }
        };

        /**
         * ChartJS config for play time line graph
         * @property {Object} playTime
         */
        $scope.playTime = {
            options: {
                segmentShowStroke : false,
                animationEasing : "easeInOutQuart",
            }
        };

        /**
         * Calculate begining and end of the week a date falls in
         * @method weekBoundaries
         * @param {String|Date}  date  Date to calcualte boundaries from
         */
        $scope.weekBoundaries = function weekBoundaries (date) {
            date = new Date(date);
            var day = date.getDay(),
                diff = date.getDate() - day + (day === 0 ? -6:1), // adjust when day is sunday
                weekBeginning = new Date(date.setDate(diff));

            return {
                from: $filter("date")(weekBeginning.toISOString(), "yyyy-MM-dd"),
                to: $filter("date")(new Date(date.setDate(diff + 6)).toISOString(), "yyyy-MM-dd"),
                label: $filter("date")(weekBeginning, "MMM d")
            };
        };

        /**
         * Format stats data for chart and adds to existing dataset
         * @method addToDataset
         * @param {Object} dataset   ChartJs config object
         * @param {Object} data      New stat data from API
         * @param {String} label     Label for dataset
         * @param {Number} maxSeries Maximum number of series to extract from data
         */
        $scope.addToDataset = function addToDataset (dataset, data, label, maxSeries) {

            // initalise dataset properties
            dataset.labels = dataset.labels || [];
            dataset.data = dataset.data || [];
            dataset.series = dataset.series || [];

            // default maximum series to 5
            maxSeries = maxSeries || 5;

            if (data.length) {

                // add dataset label
                dataset.labels.unshift(label);

                // parse data from API to chart data array
                data.forEach(function(item, index){
                    if (index < maxSeries) {
                        dataset.data[index] = dataset.data[index] || [];
                        dataset.series[index] = item.user.display_name;  // jshint ignore:line
                        dataset.data[index].unshift(Math.round(item.total/1000/60));
                    }
                });
            }
        };

        // Format most active DJ stats for charts
        stats.most_active_djs.forEach(function(item, index){  // jshint ignore:line
            if (index < 5) {
                $scope.activeDj.labels.push(item.user.display_name);  // jshint ignore:line
                $scope.activeDj.data.push(item.total);
            }
        });

        /**
         * @method loadHistoricData
         */
        $scope.loadHistoricData = function loadHistoricData () {

            var startDate = new Date();

            var weeks = [
                $scope.weekBoundaries(startDate - 7),
                $scope.weekBoundaries(startDate - 14),
                $scope.weekBoundaries(startDate - 21)
            ];

            $q.all([
                StatsResource.get({ from: weeks[0].from, to: weeks[0].to }).$promise,
                StatsResource.get({ from: weeks[1].from, to: weeks[1].to }).$promise,
                StatsResource.get({ from: weeks[2].from, to: weeks[2].to }).$promise
            ]).then(function (responses) {
                responses.forEach(function (response, index) {
                    $scope.addToDataset($scope.playTime, response.total_play_time_per_user, weeks[index].label);  // jshint ignore:line
                });
            });
        };

        /**
         * @method init
         */
        $scope.init = function init () {

            if (!$scope.search.from) {
                $scope.search.from = new Date();
            }

            // Format total play time per user stats for charts
            $scope.addToDataset($scope.playTime, stats.total_play_time_per_user, "Last Week");  // jshint ignore:line

            $scope.loadHistoricData();
        };

        $scope.init();

    }
]);
