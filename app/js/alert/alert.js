"use strict";
/**
 * @module   FM.alert
 * @author   SOON_
 */
angular.module("FM.alert", [
    "FM.alert.AlertCtrl",
    "FM.alert.AlertService"
])

.run([
    "$rootScope",
    "AlertService",
    function ($rootScope, AlertService) {
        $rootScope.AlertService = AlertService;
    }
]);
