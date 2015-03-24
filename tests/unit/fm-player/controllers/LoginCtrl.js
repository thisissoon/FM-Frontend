"use strict";

describe("sn.fm.player:LoginCtrl", function() {

    var $scope, _route, _auth;

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
                    fn.apply(this, [{ data: { access_token: "mocktoken" }}]);
                }
            };
        };
        spyOn(_auth, "authenticate");

        $controller("LoginCtrl", {
            $scope: $scope,
            $auth: _auth,
            $route: _route
        });
    }));

    it("should call $auth.authenticate", function() {
        $scope.authenticate();
        expect(_auth.authenticate).toHaveBeenCalledWith("google");
        expect(_route.reload).toHaveBeenCalled();
    });

});
