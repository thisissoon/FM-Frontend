"use strict";
/**
 * @module   FM.alert
 * @author   SOON_
 */
angular.module("FM.alert", [
    "ui.bootstrap.alert",
    "ngAnimate"
])
/**
 * @class AlertService
 * @example
 *     AlertService.set("Woah there, you'll need to login", "warning");
 */
.service("AlertService", [
    "$rootScope",
    function($rootScope){
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

                $rootScope.alertActive = true;
            },

            /**
             * Remove alert from list
             * @method remove
             * @param {Number} index   index of alert to remove
             */
            remove: function remove (index) {
                AlertService.alerts.splice(index, 1);

                if (AlertService.alerts.length === 0) {
                    $rootScope.alertActive = false;
                }
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
        $scope.closeAlert = AlertService.remove;

    }
]);
