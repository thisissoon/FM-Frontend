"use strict";

describe("sn.fm.player:LoginCtrl", function() {

    var $scope, _route, _auth, _mockTokenResponse;

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
            return {
                then: function(fn){
                    fn.apply(this, [_mockTokenResponse]);
                }
            };
        };
        _auth.removeToken = function(){};
        spyOn(_auth, "authenticate").and.callThrough();
        spyOn(_auth, "removeToken");

        _mockTokenResponse = { data: { access_token: "mocktoken" }};

        $controller("LoginCtrl", {
            $scope: $scope,
            $auth: _auth,
            $route: _route
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

});
