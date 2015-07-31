"use strict";
/**
 * Factory which provides methods to perform on thisisoon FM API
 * /users endpoint. Gets user data.
 * @module FM.api.TracksResource
 * @author SOON_
 */
angular.module("FM.api.UsersResource",[
    "config",
    "ngResource"
])
/**
 * @constructor
 * @class UsersResource
 * @param {Service} $resource
 * @param {String}  FM_API_SERVER_ADDRESS
 */
.factory("UsersResource", [
    "$resource",
    "env",
    function ($resource, env) {

        return $resource(
            env.FM_API_SERVER_ADDRESS + "users" + "/:id",
            // Default values for url parameters.
            {
                id: "@id"
            },
            {
                stats: {
                    method: "GET",
                    url: env.FM_API_SERVER_ADDRESS + "users" + "/:id/stats"
                }
            }
        );

    }
]);
