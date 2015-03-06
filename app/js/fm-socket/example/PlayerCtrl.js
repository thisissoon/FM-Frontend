"use strict";
angular.module("sn.fm.sockets.example", ["sn.fm.sockets"])

    .run([
        "fmSocketInit",
        function (fmSocketInit) {
            fmSocketInit.forward();
        }
    ])

    .controller("PlayerCtrl", [
        "$scope",
        function ($scope) {

            $scope.playing = false;

            $scope.track = {};

            $scope.playlist = [];

            $scope.$on("fm:player:play", function (event, data) {
                console.log("play");
                console.log(data);
                $scope.playing = true;
                $scope.track = data.track;
            });

            $scope.$on("fm:player:pause", function (event, data) {
                console.log("pause");
                console.log(data);
                $scope.playing = false;
            });

            $scope.$on("fm:player:resume", function (event, data) {
                console.log("resume");
                console.log(data);
                $scope.playing = true;
            });

            $scope.$on("fm:player:add", function (event, data) {
                console.log("add");
                console.log(data);
                $scope.playlist.push(data.track);
            });
        }
    ]);
