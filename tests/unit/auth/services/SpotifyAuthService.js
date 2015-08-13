"use strict";

describe("FM.auth.SpotifyAuthService", function() {

    var service, $httpBackend, $rootScope, $window, $q, ERRORS, Spotify, AlertService, TOKEN_NAME,
        fakeSpotifyLoginCallback, fakeGetItemCallback, getItemSpy, setItemSpy, removeItemSpy,
        spotifyLoginResponse, user, token, userRequest, userPlaylistRequest, playlists;

    beforeEach(function (){
        module("FM.auth.SpotifyAuthService");
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

    beforeEach(inject(function (_$httpBackend_) {
        $httpBackend = _$httpBackend_;
        user = { id: "foo" };
        playlists = [{ id: "123" }, { id: "456" }];

        userPlaylistRequest = $httpBackend.whenGET(/.*api.spotify.com\/v1\/users\/.*\/playlists/);
        userRequest = $httpBackend.whenGET(/.*api.spotify.com\/v1\/me/);

        userRequest.respond(200, user);
        userPlaylistRequest.respond(200, playlists);

    }));

    beforeEach(inject(function ( _$rootScope_, $injector ) {

        spotifyLoginResponse = "bar";

        fakeSpotifyLoginCallback = function(){
            return {
                then: function(fn){
                    fn.apply(this, [spotifyLoginResponse]);
                }
            }
        }

        fakeGetItemCallback = function(){
            return token;
        }

        $rootScope = _$rootScope_;

        $window = $injector.get("$window");
        getItemSpy = spyOn($window.localStorage, "getItem").and.callFake(fakeGetItemCallback);
        setItemSpy = spyOn($window.localStorage, "setItem").and.callFake(fakeGetItemCallback);
        removeItemSpy = spyOn($window.localStorage, "removeItem").and.callFake(fakeGetItemCallback);

        Spotify = $injector.get("Spotify");
        spyOn(Spotify, "login").and.callFake(fakeSpotifyLoginCallback);
        spyOn(Spotify, "getCurrentUser").and.callThrough();

        AlertService = $injector.get("AlertService");
        $q = $injector.get("$window");
        ERRORS = $injector.get("ERRORS");
        TOKEN_NAME = $injector.get("TOKEN_NAME");

        token = undefined;

        service = $injector.get("SpotifyAuth");

    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });


    it("should return authentication status", function () {
        var authenticated = service.isAuthenticated();
        expect(authenticated).toBeFalsy();

        service.authenticate();
        $rootScope.$digest();

        authenticated = service.isAuthenticated();
        expect(authenticated).toBeTruthy();
    });

    it("should attempt to authenticate user", function () {
        var setAuthTokenSpy = spyOn(Spotify, "setAuthToken");
        spotifyLoginResponse = "foo";
        service.authenticate();
        $rootScope.$digest();

        expect(setAuthTokenSpy).toHaveBeenCalledWith(spotifyLoginResponse);
        expect(service.isAuthenticated()).toBeTruthy();
    });

    it("should attempt to authenticate user and handle error", function () {
        // user has local token, token is expired, token is renewed
        var error = { error: { status: 401 } };
        var alertSpy = spyOn(AlertService, "set");

        spotifyLoginResponse = error;

        // login fails
        service.authenticate();
        $rootScope.$digest();

        expect(setItemSpy).not.toHaveBeenCalled();
        expect(removeItemSpy).toHaveBeenCalled();
        expect($window.localStorage.setItem).not.toHaveBeenCalled();
        expect(service.isAuthenticated()).toBeFalsy();

        // login successful
        spotifyLoginResponse = "bar";

        service.authenticate();
        $rootScope.$digest();

        expect(setItemSpy).toHaveBeenCalled();
        expect($window.localStorage.setItem).toHaveBeenCalled();
        expect(service.isAuthenticated()).toBeTruthy();
    });

    it("should get the current user", function () {
        var data;

        service.authenticate();
        $rootScope.$digest();

        service.getUser()
            .then(function (response){
                data = response;
            });

        $httpBackend.flush();
        $rootScope.$digest();

        expect(data).toEqual(user);

    });

    it("should handle error when getting current user", function () {
        var data;

        service.getUser()
            .then(function (response){
                data = response;
            });

        expect(data).not.toBe(user);

        service.authenticate();
        $rootScope.$digest();

        userRequest.respond(200, { error: { status: 401 }});

        service.authenticate();
        $rootScope.$digest();

        service.getUser()
            .then(function (response){
                data = response;
            });

        $httpBackend.flush();
        $rootScope.$digest();

        expect(data).not.toBe(user);
    });

    it("should get users playlist", function () {
        var data;

        service.authenticate();
        $rootScope.$digest();

        service.getUserPlaylists()
            .then(function (response){
                data = response;
            });

        $httpBackend.flush();
        $rootScope.$digest();
        expect(data).toEqual(playlists);
    });


});
