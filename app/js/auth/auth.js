"use strict";
/**
 * Handles authentication using OAuth
 * @module   FM.auth
 * @author   SOON_
 * @requires FM.auth.google
 * @requires FM.auth.spotify
 */
angular.module("FM.auth", [
    "FM.auth.google",
    "FM.auth.spotify"
]);
