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
]);
