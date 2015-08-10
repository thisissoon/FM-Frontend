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

    it("should attempt to get current user if auth token exists", function () {
        var setAuthTokenSpy = spyOn(Spotify, "setAuthToken");
        token = "foo";

        service.init();
        $httpBackend.flush();
        $rootScope.$digest();

        expect(setAuthTokenSpy).toHaveBeenCalledWith(token);
        expect(Spotify.getCurrentUser).toHaveBeenCalled();
    });

    it("should NOT attempt to get current user if auth token doesn't exists", function () {
        var setAuthTokenSpy = spyOn(Spotify, "setAuthToken");
        getItemSpy.and.callFake(function(){ return null });

        service.init();
        $rootScope.$digest();
        expect(setAuthTokenSpy).not.toHaveBeenCalled();
        expect(Spotify.getCurrentUser).not.toHaveBeenCalled();
    });

    it("should authenticate the user if token has expired", function () {
        var setAuthTokenSpy = spyOn(Spotify, "setAuthToken");

        user = { error: { status: 401 } };
        userRequest.respond(200, user);
        token = "foo";

        service.init();
        $httpBackend.flush();
        $rootScope.$digest();

        expect(setAuthTokenSpy).toHaveBeenCalled();
        expect(Spotify.getCurrentUser).toHaveBeenCalled();

        user = { error: { status: 401 } };
        userRequest.respond(401, user);

        service.init();
        $httpBackend.flush();
        $rootScope.$digest();

        expect(setAuthTokenSpy.calls.count()).toEqual(3);
        expect(Spotify.getCurrentUser.calls.count()).toEqual(2);

        spotifyLoginResponse = { error: { status: 401 } };

        service.init();
        $httpBackend.flush();
        $rootScope.$digest();

        expect(setAuthTokenSpy.calls.count()).toEqual(4);
        expect(Spotify.getCurrentUser.calls.count()).toEqual(3);

        user = { error: { status: 404 } };
        userRequest.respond(404, user);

        service.init();
        $httpBackend.flush();
        $rootScope.$digest();

        expect(setAuthTokenSpy.calls.count()).toEqual(5);
        expect(Spotify.getCurrentUser.calls.count()).toEqual(4);
    });

    it("should return authentication status", function () {
        var authenticated = service.isAuthenticated();
        expect(authenticated).toBeFalsy();
        token = "foo";

        service.getUser();

        $httpBackend.flush();
        $rootScope.$digest();

        authenticated = service.isAuthenticated();
        expect(authenticated).toBeTruthy();
    });

    it("should attempt to authenticate user", function () {
        token = "foo";
        var setAuthTokenSpy = spyOn(Spotify, "setAuthToken");
        service.authenticate();
        $httpBackend.flush();
        $rootScope.$digest();

        expect(setAuthTokenSpy).toHaveBeenCalledWith(token);
        expect(service.isAuthenticated()).toBeTruthy();
    });

    it("should attempt to authenticate user and handle error", function () {
        // user has local token, token is expired, token is renewed
        var error = { error: { status: 401 } };
        token = "foo";
        userRequest.respond(200, error);
        var setAuthTokenSpy = spyOn(Spotify, "setAuthToken");
        var alertSpy = spyOn(AlertService, "set");

        service.authenticate();
        $httpBackend.flush();
        $rootScope.$digest();

        expect(setAuthTokenSpy.calls.count()).toBe(2);
        expect($window.localStorage.setItem.calls.count()).toBe(1);
        expect(service.isAuthenticated()).toBeTruthy();

        // user has local token, token is still valid
        userRequest.respond(200, user);

        service.authenticate();
        $httpBackend.flush();
        $rootScope.$digest();

        expect(setAuthTokenSpy.calls.count()).toBe(3);
        expect($window.localStorage.setItem.calls.count()).toBe(1);
        expect(service.isAuthenticated()).toBeTruthy();

        // user has local token, token is expired, token renewal fails
        userRequest.respond(200, error);
        spotifyLoginResponse = error;

        service.authenticate();
        $httpBackend.flush();
        $rootScope.$digest();

        expect(setAuthTokenSpy.calls.count()).toBe(4);
        expect($window.localStorage.setItem.calls.count()).toBe(1);
        expect(service.isAuthenticated()).toBeFalsy();

        // user does NOT have local token, user authentication fails
        spotifyLoginResponse = { error: { status: 401 } };
        token = undefined;

        service.authenticate();
        $rootScope.$digest();

        expect(setAuthTokenSpy.calls.count()).toBe(4);
        expect($window.localStorage.setItem.calls.count()).toBe(1);
        expect(service.isAuthenticated()).toBeFalsy();

        // user does NOT have local token, user authentication successful
        spotifyLoginResponse = "bar";

        service.authenticate();
        $rootScope.$digest();

        expect(setAuthTokenSpy.calls.count()).toBe(5);
        expect($window.localStorage.setItem.calls.count()).toBe(2);
        expect(service.isAuthenticated()).toBeTruthy();
    });

    it("should get the current user", function () {
        token = "foo";
        var data;

        service.getUser()
            .then(function (response){
                data = response;
            });

        $httpBackend.flush();
        $rootScope.$digest();

        expect(data).toEqual(user);

    });

    it("should handle error when getting current user", function () {
        token = "foo";
        var data;

        userRequest.respond(400, { error: { status: 401 }});

        service.getUser()
            .then(function (response){
                data = response;
            });

        $httpBackend.flush();
        $rootScope.$digest();
        expect(data).not.toBe(user);
    });

    it("should get users playlist", function () {
        token = "foo";
        var data;

        service.getUserPlaylists()
            .then(function (response){
                data = response;
            });

        $httpBackend.flush();
        $rootScope.$digest();
        expect(data).toEqual(playlists);
    });

});
