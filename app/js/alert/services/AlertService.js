"use strict";
/**
 * @module   FM.alert.AlertService
 * @author   SOON_
 */
angular.module("FM.alert.AlertService", [

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
             * Remove alert from list
             * @method remove
             * @param {Number} index   index of alert to remove
             */
            remove: function remove (index) {
                AlertService.alerts.splice(index, 1);
            },

            /**
             * List of alerts
             * @property {Array} alerts
             */
            alerts: []

        };

        return AlertService;
    }
]);