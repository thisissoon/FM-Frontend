"use strict";
/**
 * listens to event from FM Socket
 * to display notifications from the
 * playlist and current track
 * @module   FM.notifications
 * @author   SOON_
 */
angular.module("FM.notifications", [
    "notification"
])
/**
 * @class Notifications
 * @param {Service} $rootScope
 * @param {Service} $q
 * @param {Service} $notification
 */
.service("Notifications", [
    "$rootScope",
    "$q",
    "$notification",
    function ($rootScope, $q, $notification){

        /**
         * Get all the data
         * @method onPlay
         */
        var onPlay = function onPlay(){
            PlayerTransportResource.get().$promise
                .then(function (response){
                    var track = response[0];

                    if (track && track.track) {

                        $notification("Now Playing", {
                            body: track.track.artists[0].name + " - " + track.track.album.name + ": " + track.track.name,
                            icon: track.track.album.images[0].url
                        });
                    }
                });
        };


        /**
         * On add event, get track data and push to playlist
         * @method onAdd
         */
        var onAdd = function onAdd(event, data) {
            $q.all([
                TracksResource.get({ id: data.uri }).$promise,
                UsersResource.get({ id: data.user }).$promise
            ]).then(function (response){
                var item = {
                    track: response[0],
                    user: response[1]
                };

                if (item.track && item.user) {
                    $notification("Track Added", {
                        body: item.user.display_name + " added " + item.track.artists[0].name + " - " + item.track.album.name + ": " + item.track.name, //jshint ignore:line
                        icon: item.track.album.images[0].url
                    });
                }
            });

        }

        $rootScope.$on("fm:player:add", onAdd);
        $rootScope.$on("fm:player:play", onPlay);

    }
])
