"use strict";
/**
 * Creates a socket instance for interacting with thisisoon.fm
 * Event handles can be passed to fmSocket using
 * 'fmSocket.addListener("fm:player:play", eventHandler)' the service will
 * call the event handler with the arguments (data) every time a matching
 * socket event is received. `data` is a data object passed with the event,
 * this will contain event and track data. The handlers can be removed by
 * using 'fmSocket.removeListener("fm:player:play", eventHandler)'
 *
 * @module FM.sockets
 * @author SOON_
 */
angular.module("FM.sockets", [
    "ENV",
    "btford.socket-io"
])

    .run([
        "fmSocket",
        "FM_SOCKET_EVENTS",
        /**
         * @constructor
         * @param {Factory} fmSocket socket instance
         * @param {Array}   FM_SOCKET_EVENTS   list of available socket events
         */
        function(fmSocket, FM_SOCKET_EVENTS){
            /**
             * Forwards all fm.socket events to angular event system
             */
            fmSocket.forward(FM_SOCKET_EVENTS);
        }
    ])

    /**
     * @constant {Array} list of available socket events
     */
    .constant("FM_SOCKET_EVENTS", [
        "fm:player:play",
        "fm:player:end",
        "fm:player:pause",
        "fm:player:resume",
        "fm:player:add",
        "fm:player:setMute",
        "fm:player:setVolume"
    ])

    /**
     * socket.io library
     * for realtime event based communication
     */
    .value("io", window.io)

    .factory("fmSocket", [
        "io",
        "socketFactory",
        "FM_SOCKET_ADDRESS",
        /**
         * @constructor
         * @param   {Object}  socket.io         socket transport library
         * @param   {Factory} socketFactory     socket instance factory
         * @param   {String}  FM_SOCKET_ADDRESS address of socket server
         * @returns {Object}  socket.io instance
         */
        function (io, socketFactory, FM_SOCKET_ADDRESS) {

            return socketFactory({
                prefix: "",
                ioSocket: io.connect(FM_SOCKET_ADDRESS)
            });

        }
    ]);
