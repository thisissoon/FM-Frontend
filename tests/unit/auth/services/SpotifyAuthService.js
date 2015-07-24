"use strict";

describe("FM.auth.SpotifyAuthService", function() {

    var service, $httpBackend, $rootScope, $window, $q, ERRORS, Spotify, AlertService, TOKEN_NAME, token,
        fakeSpotifyLoginCallback, fakeGetItemCallback, message, user, userRequest;

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

        fakeSpotifyLoginCallback = function(){
            return {
                then: function(fn){
                    fn.apply(this, [token]);
                    return fakeSpotifyLoginCallback();
                },
                catch: function(fn){
                    fn.apply(this, [{ message: message, errors: { code: 400 } }]);
                    return fakeSpotifyLoginCallback();
                }
            }
        }

        fakeGetItemCallback = function(){
            return token;
        }

        $rootScope = _$rootScope_;

        $window = $injector.get("$window");
        $window.localStorage = {}
        spyOn($window.localStorage, "getItem").and.callFake(fakeGetItemCallback);
        spyOn($window.localStorage, "setItem").and.callFake(fakeGetItemCallback);

        Spotify = $injector.get("Spotify");
        spyOn(Spotify, "login").and.callFake(fakeSpotifyLoginCallback);

        AlertService = $injector.get("AlertService");
        $q = $injector.get("$window");
        ERRORS = $injector.get("ERRORS");
        TOKEN_NAME = $injector.get("TOKEN_NAME");

        token = undefined;

        message = "Validation Error";

        service = $injector.get("SpotifyAuth");

    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it("should attempt to get current user if auth token exists", function () {
        var setAuthTokenSpy = spyOn(Spotify, "setAuthToken");
        var getUserSpy = spyOn(service, "getCurrentUser");
        token = "foo";

        service.init();
        expect(setAuthTokenSpy).toHaveBeenCalledWith(token);
        expect(getUserSpy).toHaveBeenCalled();
    })

    it("should NOT attempt to get current user if auth token doesn't exists", function () {
        var setAuthTokenSpy = spyOn(Spotify, "setAuthToken");
        var getUserSpy = spyOn(service, "getCurrentUser");

        service.init();
        expect(setAuthTokenSpy).not.toHaveBeenCalled();
        expect(getUserSpy).not.toHaveBeenCalled();
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
        var setAuthTokenSpy = spyOn(Spotify, "setAuthToken");
        service.authenticate();
        $rootScope.$digest();

        expect(setAuthTokenSpy).toHaveBeenCalledWith(token);
        expect($window.localStorage.setItem).toHaveBeenCalledWith(TOKEN_NAME, token);

        message = "";

        service.authenticate();
        $rootScope.$digest();

        expect(setAuthTokenSpy.calls.count()).toBe(2);
        expect($window.localStorage.setItem.calls.count()).toBe(2);
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

        var authSpy = spyOn(service, "authenticate")

        authSpy.and.callFake(function(){
            return {
                then: function(){
                    return {
                        catch: function(fn){
                            fn.apply(this,[{}]);
                        }
                    }
                }
            }
        });

        service.user = { id: "foo" };

        service.getCurrentUser();
        $httpBackend.flush();
        $rootScope.$digest();
        expect(service.user).toBeNull();

        authSpy.and.callFake(function(){
            return {
                then: function(fn){
                    userRequest.respond(200, user);
                    fn.apply(this,[{}]);
                    return {
                        catch: function(fn){}
                    }
                }
            }
        });

        service.user = null;

        service.getCurrentUser();
        $httpBackend.flush();
        $rootScope.$digest();
        expect(service.user).toEqual(user);

    });

});
