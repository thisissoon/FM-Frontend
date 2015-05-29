"use strict";
/**
 * Controller for thisissoon FM player
 * @module FM.player.PlayerCtrl
 * @author SOON_
 */
angular.module("FM.player.PlayerCtrl",[
    "FM.player.PlayerService"
])
/**
 * @class PlayerCtrl
 * @param {Object}  $scope
 * @param {Service} PlayerService
 */
.controller("PlayerCtrl", [
    "$scope",
    "PlayerService",
    function ($scope, PlayerService) {

        /**
         * @property player
         * @type     {Object}
         */
        $scope.player = PlayerService;


    }

]);
