"use strict";
/**
 * @module   FM.stats
 * @author   SOON_
 */
angular.module("FM.stats", [
    "FM.stats.StatsCtrl",
    "FM.stats.DateUtils",
    "FM.stats.StatsResolver"
])
/**
 * Colour scheme for charts
 * @property {Array} CHART_COLOURS
 */
.value("CHART_COLOURS", [
    "#08589e",
    "#2b8cbe",
    "#4eb3d3",
    "#7bccc4",
    "#a8ddb5",
    "#ccebc5",
    "#e0f3db",
    "#f7fcf0"
])
/**
 * ChartJS global chart options
 * @property {Object} CHART_OPTIONS
 */
.constant("CHART_OPTIONS", {
    segmentShowStroke : false,
    animationEasing : "easeInOutQuart"
});
