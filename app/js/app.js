"use strict";
/**
 * Searches for tracks using spotify and sends track uri data to
 * thisissoon FM API to add to the thisissoon FM player playlist
 * @module   FM
 * @main     FM
 * @author   SOON_
 */
angular.module("FM", [
    "FM.alert",
    "FM.api",
    "FM.auth",
    "FM.history",
    "FM.notifications",
    "FM.playlist",
    "FM.player",
    "FM.search",
    "FM.sockets",
    "FM.loadingScreen",
    "FM.nav",
    "FM.stats",
    "ngRoute",
    "config",
    "spotify"
])
/**
 * @method config
 * @param  {Provider} $routeProvider
 * @param  {Provider} $locationProvider
 * @param  {Boolean}  HTML5_LOCATION
 */
.config([
    "$routeProvider",
    "$locationProvider",
    "env",
    "SpotifyProvider",
    function ($routeProvider, $locationProvider, $notificationProvider, env, SpotifyProvider) {

        $locationProvider.html5Mode(env.HTML5_LOCATION).hashPrefix = "!";

        $routeProvider
            .when("/401", { templateUrl: "partials/401.html" })
            .when("/500", { templateUrl: "partials/500.html" })
            .otherwise({ redirectTo: "/" });

        SpotifyProvider.setClientId("706dc770a95f4b83b60b72b79d6e818f");
        SpotifyProvider.setRedirectUri("http://localhost:8000/app/partials/spotify-login.html");
        SpotifyProvider.setScope("user-read-private playlist-read-private playlist-modify-private playlist-modify-public");
    }
])
.run([
    "$rootScope",
    "Spotify",
    "env",
    function ($rootScope, Spotify, env){
        $rootScope.loginSpotify = function loginSpotify(){
            Spotify.login().then(function (response){
                console.log(response);
                Spotify.setAuthToken(response);
                Spotify.getFeaturedPlaylists({ country: env.REGION_CODE });
            });
        };
    }
]);
