"use strict";

describe("FM.auth.SpotifyAuthService", function() {

    var service, $httpBackend, $rootScope, $window, $q, ERRORS, Spotify, AlertService, TOKEN_NAME,
        fakeSpotifyLoginCallback, fakeGetItemCallback,
        spotifyResponse, user, token, userRequest;

    window.localStorage = {};

    beforeEach(function (){
        module("FM.auth.SpotifyAuthService");
    });

    beforeEach(inject(function (_$httpBackend_) {
        $httpBackend = _$httpBackend_;
        user = { id: "foo" };

        userRequest = $httpBackend.whenGET(/.*api.spotify.com\/v1\/me.*/);

        userRequest.respond(200, user);

    }));

    beforeEach(inject(function ( _$rootScope_, $injector ) {

        spotifyResponse = [token];

        fakeSpotifyLoginCallback = function(){
            return {
                then: function(fn){
                    fn.apply(this, [token]);
                }
            }
        }

        fakeGetItemCallback = function(){
            return token;
        }

        $rootScope = _$rootScope_;

        $window = $injector.get("$window");
        $window.localStorage = {};
        spyOn($window.localStorage, "getItem").and.callFake(fakeGetItemCallback);
        spyOn($window.localStorage, "setItem").and.callFake(fakeGetItemCallback);
        spyOn($window.localStorage, "removeItem").and.callFake(fakeGetItemCallback);

        Spotify = $injector.get("Spotify");
        spyOn(Spotify, "login").and.callFake(fakeSpotifyLoginCallback);
        spyOn(Spotify, "getUser").and.callThrough();

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
        var getUserSpy = spyOn(service, "getCurrentUser").and.callThrough();
        token = "foo";

        service.init();
        $httpBackend.flush();
        $rootScope.$digest();

        expect(setAuthTokenSpy).toHaveBeenCalledWith(token);
        expect(getUserSpy).toHaveBeenCalled();
    });

    it("should NOT attempt to get current user if auth token doesn't exists", function () {
        var setAuthTokenSpy = spyOn(Spotify, "setAuthToken");
        var getUserSpy = spyOn(service, "getCurrentUser");

        service.init();
        $rootScope.$digest();
        expect(setAuthTokenSpy).not.toHaveBeenCalled();
        expect(getUserSpy).not.toHaveBeenCalled();
    });

    it("should authenticate the user if token has expired", function () {
        var setAuthTokenSpy = spyOn(Spotify, "setAuthToken"),
            getUserSpy = spyOn(service, "getCurrentUser").and.callThrough(),
            authSpy = spyOn(service, "authenticate");

        user = { error: { status: 401 } };
        userRequest.respond(200, user);
        token = "foo";

        service.init();
        $httpBackend.flush();
        $rootScope.$digest();

        expect(setAuthTokenSpy).toHaveBeenCalled();
        expect(getUserSpy).toHaveBeenCalled();
        expect(authSpy).toHaveBeenCalled();

        user = { error: { status: 404 } };
        userRequest.respond(200, user);

        service.init();
        $httpBackend.flush();
        $rootScope.$digest();

        expect(setAuthTokenSpy.calls.count()).toEqual(2);
        expect(getUserSpy.calls.count()).toEqual(2);
        expect(authSpy.calls.count()).toEqual(1);
    });

    it("should return authentication status", function () {
        service.authenticated = false;

        var authenticated = service.isAuthenticated();
        expect(authenticated).toBeFalsy();

        service.authenticated = true;

        var authenticated = service.isAuthenticated();
        expect(authenticated).toBeTruthy();
    });

    it("should attempt to authenticate user", function () {
        token = "foo";
        var setAuthTokenSpy = spyOn(Spotify, "setAuthToken");
        service.authenticate();
        $rootScope.$digest();

        expect(setAuthTokenSpy).toHaveBeenCalledWith(token);
        expect($window.localStorage.setItem).toHaveBeenCalledWith(TOKEN_NAME, token);
    });

    it("should attempt to authenticate user and handle error", function () {
        token = { error: { status: 401 } };
        var setAuthTokenSpy = spyOn(Spotify, "setAuthToken");
        var alertSpy = spyOn(AlertService, "set");
        service.authenticate();
        $rootScope.$digest();

        expect(setAuthTokenSpy).not.toHaveBeenCalled();
        expect($window.localStorage.setItem).not.toHaveBeenCalled();
        expect(alertSpy).toHaveBeenCalled();
        expect(service.authenticated).toBeFalsy();
        expect($window.localStorage.removeItem).toHaveBeenCalledWith(TOKEN_NAME);
    });

    it("should get the current user", function () {
        var setAuthTokenSpy = spyOn(Spotify, "setAuthToken");
        service.getCurrentUser();
        $httpBackend.flush();
        $rootScope.$digest();

        expect(service.user).toEqual(user);

    });

    it("should handle error when getting current user", function () {
        service.user = { id: "foo" };
        userRequest.respond(400, {});

        service.getCurrentUser();
        $httpBackend.flush();
        $rootScope.$digest();
        expect(service.user).toBeNull();
    });

});
