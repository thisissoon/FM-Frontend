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

    /**
     * @constant {String} address of thisisoon.fm socket server
     */
    .constant("FM_SOCKET_ADDRESS", "http://localdocker:8080")

    /**
     * @constant {Array} list of available socket events
     */
    .constant("EVENTS", [
        "fm:player:play",
        "fm:player:pause",
        "fm:player:resume",
        "fm:player:add"
    ])

    .factory("fmSocket", [
        "socketFactory",
        "FM_SOCKET_ADDRESS",
        /**
         * @constructor
         * @param   {Factory} socketFactory  factory for creating socket instances
         * @returns {Object}  socket.io instance
         */
        function (socketFactory, FM_SOCKET_ADDRESS) {

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
                forward: function(){
                    fmSocket.forward(EVENTS);
                }
            }
        }
    ]);
