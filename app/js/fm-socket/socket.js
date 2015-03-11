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
 * @module sn.fm.sockets
 * @author SOON_
 */
angular.module("sn.fm.sockets", [
    "ENV",
    "btford.socket-io"
])

    /**
     * @constant {Array} list of available socket events
     */
    .constant("EVENTS", [
        "fm:player:play",
        "fm:player:pause",
        "fm:player:resume",
        "fm:player:add"
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
    ])

    .service("fmSocketInit", [
        "fmSocket",
        "EVENTS",
        /**
         * @constructor
         * @param {Factory} fmSocket socket instance
         * @param {Array}   EVENTS   list of available socket events
         */
        function (fmSocket, EVENTS) {
            return {
                forward: function forward() {
                    fmSocket.forward(EVENTS);
                }
            };
        }
    ]);
