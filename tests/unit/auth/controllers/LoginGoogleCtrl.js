"use strict";

describe("FM.auth.LoginGoogleCtrl", function() {

    var $scope, _route, _auth, AlertService, _mockTokenResponse, _mockAuthError, ERRORS;

    beforeEach(function (){
        module("FM.auth.LoginGoogleCtrl");
    });

    beforeEach(inject(function ( $rootScope, $injector, $controller ) {
        $scope = $rootScope.$new();

        _route = {
            reload: function(){}
        };
        spyOn(_route, "reload");

        AlertService = $injector.get("AlertService");

        _auth = $injector.get("$auth");
        _auth.authenticate = function(provider){
            var $promise = {
                then: function(fn){
                    fn.apply(this, [_mockTokenResponse]);
                    return $promise;
                },
                catch: function(fn){
                    fn.apply(this, [_mockAuthError]);
                    return $promise;
                }
            };

            return $promise;
        };
        _auth.removeToken = function(){};
        spyOn(_auth, "authenticate").and.callThrough();
        spyOn(_auth, "removeToken");

        _mockAuthError = { message: "Expecting a token named \"access_token\" but instead got: {\"message\":\"Validation Error\",\"errors\":{\"code\":[\"You need be a member of SOON_ or This Here\"]}}" };
        _mockTokenResponse = { data: { access_token: "mocktoken" }};

        ERRORS = $injector.get("ERRORS");

        $controller("LoginGoogleCtrl", {
            $scope: $scope,
            $auth: _auth,
            $route: _route,
            ERRORS: ERRORS,
            AlertService: AlertService
        });
    }));

    it("should call $auth.authenticate and reload", function() {
        $scope.authenticate();
        expect(_auth.authenticate).toHaveBeenCalledWith("google");
        expect(_route.reload).toHaveBeenCalled();
    });

    it("should call remove token if no token is returned in auth", function() {
        _mockTokenResponse.data.access_token = undefined;
        $scope.authenticate();
        expect(_auth.removeToken).toHaveBeenCalled();
    });

    it("should show authentication validation error alert", function() {
        spyOn(AlertService, "set");

        $scope.authenticate();
        expect(AlertService.set).toHaveBeenCalledWith(ERRORS.AUTH_VALIDATION_TITLE, "You need be a member of SOON_ or This Here");
        expect(_auth.removeToken).toHaveBeenCalled();
    });

    it("should NOT show authentication validation error alert", function() {
        spyOn(AlertService, "set");
        _mockAuthError = { message: "" };

        $scope.authenticate();
        expect(AlertService.set).not.toHaveBeenCalled();
        expect(_auth.removeToken).toHaveBeenCalled();
    });

});
