"use strict";

describe("FM.users.UserPlaylistsCtrl", function() {

    var $scope, $route, $rootScope, $httpBackend, SpotifyAuth, $location, $window, env,
        userResponse, playlistsResponse;

    beforeEach(function (){
        module("FM.users.UserPlaylistsCtrl");
        module(function ($provide) {
            $provide.value("$window", {
                localStorage: {
                    getItem: function(){ return null; },
                    setItem: function(){ return null; },
                    removeItem: function(){}
                }
            });
        });
    });

    beforeEach(inject(function (_$httpBackend_, $injector) {
        $httpBackend = _$httpBackend_;

        env = $injector.get("env");

        userResponse = { id: "foo" };
        playlistsResponse = { items: [{ id: "bar" }, { id: "baz" }] };

        $httpBackend.whenGET(/partials\/.*/).respond(200, "");
        $httpBackend.whenGET(/api.spotify.com\/v1\/users\/.*\/playlists/).respond(200, playlistsResponse);
        $httpBackend.whenGET(/api.spotify.com\/v1\/users\/.*/).respond(200, userResponse);
        $httpBackend.whenGET(env.FM_API_SERVER_ADDRESS + "users/authenticated").respond(200, userResponse);
    }));

    beforeEach(inject(function (  _$location_, _$route_, _$rootScope_, $injector, $controller ) {
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();

        $route = _$route_;

        $location = $injector.get("$location");

        $window = $injector.get("$window");
        $window.localStorage = {
            getItem: function(id){
                return "foo";
            }
        };
        spyOn($window.localStorage, "getItem").and.callThrough();

        SpotifyAuth = $injector.get("SpotifyAuth");
        spyOn(SpotifyAuth, "getUserPlaylists").and.callFake(function(){
            return {
                then: function(fn){
                    fn.apply(this, [playlistsResponse]);
                }
            }
        });

        $controller("UserPlaylistsCtrl", {
            $scope: $scope,
            SpotifyAuth: SpotifyAuth,
            playlists: playlistsResponse,
            user: userResponse,
            env: env
        });
    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it("should load user playlist view", function() {
        $location.path("/users/me/playlists/");
        $rootScope.$digest();
        $httpBackend.flush();
        expect($route.current.controller).toBe("UserPlaylistsCtrl");
    });

    it("should load more tracks", function() {
        expect($scope.playlists).toEqual(playlistsResponse.items);
        expect($scope.playlists.length).toBe(2);
        $scope.loadMore();
        $rootScope.$digest();

        expect($scope.playlists.length).toBe(4);
    });

});
