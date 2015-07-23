"use strict";
/**
 * Handles authentication for Spotify
 * @module   FM.auth.spotify
 * @author   SOON_
 * @requires config
 */
angular.module("FM.auth.spotify", [
    "FM.auth.LoginSpotifyCtrl",
    "config",
    "spotify"
])
/**
 * @method config
 * @param {Service} $authProvider
 * @param {Object}  env
 */
.config([
    "SpotifyProvider",
    "env",
    function (SpotifyProvider, env) {

        SpotifyProvider.setClientId(env.SPOTIFY_CLIENT_ID);
        SpotifyProvider.setRedirectUri(env.SPOTIFY_REDIRECT_URI);
        SpotifyProvider.setScope(env.SPOTIFY_SCOPE);

    }
])
/**
 * @method run
 * @param  {Service} $rootScope
 * @param  {Service} $window
 * @param  {Service} Spotify
 */
.run([
    "$rootScope",
    "$window",
    function ($rootScope, $window){

        /**
         * Set isAuthenticatedSpotify if token exists
         * @returns {Boolean} user is authenticated
         */
        $rootScope.isAuthenticatedSpotify = function isAuthenticatedSpotify() {
            return $window.localStorage.getItem("spotify-token");
        };

    }
]);
