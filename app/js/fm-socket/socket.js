/**
 * Creates a socket instance for interacting with thisisoon.fm
 * Event handles can be passed to fmSocket using 'fmSocket.addListener("fm:player:play", eventHandler)'
 * the service will call the event handler with the arguments (data) every time a matching socket event
 * is received. `data` is a data object passed with the event, this will contain event and track data.
 * The handlers can be removed by using 'fmSocket.removeListener("fm:player:play", eventHandler)'
 *
 * @module sn.fm.sockets
 * @author SOON_
 */
angular.module("sn.fm.sockets", [
    "btford.socket-io",
])

    .factory("fmSocket", [
        "socketFactory",
        /**
         * @constructor
         * @param   {Factory} socketFactory  factory for creating socket instances
         * @returns {Object}  socket.io instance
         */
        function (socketFactory) {

            return socketFactory({
                prefix: "",
                ioSocket: io.connect("http://localdocker:8080")
            });

        }
    ]);
