"use strict";

describe("FM.auth.LoginSpotifyCtrl", function() {

    var $rootScope, $scope, SpotifyAuth, user;

    beforeEach(function (){
        module("FM.auth.LoginSpotifyCtrl");
    });

    beforeEach(inject(function ( _$rootScope_, $injector, $controller ) {
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();

        user = { id: "foo" };

        SpotifyAuth = $injector.get("SpotifyAuth");
        SpotifyAuth.user = user;

        $controller("LoginSpotifyCtrl", {
            $scope: $scope,
            SpotifyAuth: SpotifyAuth
        });
    }));

    it("should get spotify user", function() {
        var user = $scope.getUser();
        expect(user).toEqual(user);
    });

    it("should attempt to authenticate user", function() {
        var spy = spyOn(SpotifyAuth, "authenticate");
        $scope.authenticate();

        expect(spy).toHaveBeenCalled();
    });

    it("should get authenticated status", function() {
        SpotifyAuth.authenticated = true;

        var spy = spyOn(SpotifyAuth, "isAuthenticated").and.callThrough();
        var authenticated = $scope.isAuthenticated();
        $rootScope.$digest();

        expect(spy).toHaveBeenCalled();
        expect(authenticated).toBeTruthy();

        SpotifyAuth.authenticated = false;
        authenticated = $scope.isAuthenticated();
        $rootScope.$digest();

        expect(spy.calls.count()).toBe(2);
        expect(authenticated).toBeFalsy();
    });

});
