"use strict";

describe("sn.fm.player:LoginCtrl", function() {

    var $scope, _route, _auth, _mdDialog, _mockTokenResponse, _mockAuthError, ERRORS;

    beforeEach(function (){
        module("sn.fm.player");
    });

    beforeEach(inject(function ( $rootScope, $injector, $controller ) {
        $scope = $rootScope.$new();

        _route = {
            reload: function(){}
        };
        spyOn(_route, "reload");

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

        _mdDialog = $injector.get("$mdDialog");

        _mockAuthError = { message: "Expecting a token named \"access_token\" but instead got: {\"message\":\"Validation Error\",\"errors\":{\"code\":[\"You need be a member of SOON_ or This Here\"]}}" };
        _mockTokenResponse = { data: { access_token: "mocktoken" }};

        ERRORS = $injector.get("ERRORS");

        $controller("LoginCtrl", {
            $scope: $scope,
            $auth: _auth,
            $route: _route,
            $mdDialog: _mdDialog,
            ERRORS: ERRORS
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
        spyOn($scope, "showAlert");

        $scope.authenticate();
        expect($scope.showAlert).toHaveBeenCalledWith(ERRORS.AUTH_VALIDATION_TITLE, "You need be a member of SOON_ or This Here");
        expect(_auth.removeToken).toHaveBeenCalled();
    });

    it("should NOT show authentication validation error alert", function() {
        spyOn($scope, "showAlert");
        _mockAuthError = { message: "" };

        $scope.authenticate();
        expect($scope.showAlert).not.toHaveBeenCalled();
        expect(_auth.removeToken).toHaveBeenCalled();
    });

});
