"use strict";
/**
 * @module   FM.alert.AlertCtrl
 * @author   SOON_
 */
angular.module("FM.alert.AlertCtrl", [
    "ui.bootstrap.alert",
    "ngAnimate"
])
/**
 * @constructor
 * @class   AlertCtrl
 * @param   {Object} $scope
 */
.controller("AlertCtrl", [
    "$scope",
    "AlertService",
    function($scope, AlertService){

        /**
         * List of alerts
         * @property {Array} alerts
         */
        $scope.alerts = AlertService.alerts;

        /**
         * Close specific alert
         * @method closeAlert
         * @param {Number} index   of alert to close
         */
        $scope.closeAlert = AlertService.remove;

    }
]);
