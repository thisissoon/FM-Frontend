"use strict";
/**
 * @module FM.sockets.sails
 * @author SOON_
 */
angular.module("FM.sockets.sails", [
    "FM.socket.sails.PlayerQueueSocket",
    "config",
    "angularSails.io"
])

.factory("sailsSocket", [
    "$sailsSocket",
    "env",
    function ($sailsSocket, env) {

      return $sailsSocket({ baseUrl: "http://localhost:1337" });

    }
])

.factory("sailsResource", [
    "sailsSocket",
    function (sailsSocket) {

        var SailsResource = function SailsResource (identity, options) {
            options = options || {};
            identity = identity.replace(/^\/|\/$/g, '');

            var prefix = options.prefix || "/api/";

            this.url = prefix + identity;
            this.event = identity;
            this.baseUrl = sailsSocket._socketOptions.baseUrl;
        };

        SailsResource.prototype.get = function getResource (options) {
            var self = this;
            return sailsSocket.get(self.url, options);
        };

        SailsResource.prototype.save = function deleteResource (options) {
            var self = this;
            return sailsSocket.post(self.url, options);
        };

        SailsResource.prototype.remove = function deleteResource (options) {
            var self = this;
            return sailsSocket.delete(self.url, options);
        };

        SailsResource.prototype.on = function on (event, handler) {
            var self = this;

            return sailsSocket.on(self.event, function (message) {
                if (event === message.verb) {
                    handler.apply(this, [message.verb, message.data]);
                }
            });
        };

        return SailsResource;
    }
]);
