"use strict";
/**
 * @module   FM.alert
 * @author   SOON_
 */
angular.module("FM.alert", [
    "ui.bootstrap.alert"
])
/**
 * @class AlertService
 * @example
 *     AlertService.set("Woah there, you'll need to login", "warning");
 */
.service("AlertService", [
    function(){
        var AlertService = {

            /**
             * Set new alert
             * @method set
             * @param {String} message  alert message to set
             * @param {String} type     bootstrap style class (warning|danger|success|info)
             */
            set: function set (message, type) {
                AlertService.alerts.push({
                    message: message,
                    type: type
                });
            },

            /**
             * List of alerts
             * @property {Array} alerts
             */
            alerts: []

        };

        return AlertService;
    }
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
        $scope.closeAlert = function closeAlert (index) {
            $scope.alerts.splice(index, 1);
        };

    }
]);
