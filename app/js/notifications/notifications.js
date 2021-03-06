"use strict";
/**
 * listens to event from FM Socket
 * to display notifications from the
 * playlist and current track
 * @module   FM.notifications
 * @author   SOON_
 */
angular.module("FM.notifications", [
    "FM.api.PlayerTransportResource",
    "FM.api.TracksResource",
    "FM.api.UsersResource",
    "notification"
])
/**
 * @method config
 * @param  {Provider} $notificationProvider
 */
.config([
    "$notificationProvider",
    function ($notificationProvider) {

        $notificationProvider.setOptions({ delay: 5000 });
    }
])
/**
 * @method run
 * @param  {Service} Notifications
 */
.run(["Notifications",
    function (Notifications){
        Notifications.init();
    }
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
    "PlayerTransportResource",
    "TracksResource",
    "UsersResource",
    function ($rootScope, $q, $notification, PlayerTransportResource, TracksResource, UsersResource){

        /**
         * @private
         * Get all the data
         * @method onPlay
         */
        var onPlay = function onPlay(){
            PlayerTransportResource.get().$promise
                .then(function (response){

                    if (response && response.track) {

                        $notification("Now Playing", {
                            body: response.track.artists[0].name + " - " + response.track.album.name + ": " + response.track.name,
                            icon: response.track.album.images[0].url
                        });
                    }
                });
        };


        /**
         * @private
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

        };

        /**
         * @public
         * @method init
         */
        this.init = function init(){
            onPlay();
            $rootScope.$on("fm:player:add", onAdd);
            $rootScope.$on("fm:player:play", onPlay);
        };

    }
]);
