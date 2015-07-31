"use strict";

describe("FM.auth.google", function() {
    var $rootScope, $auth;

    beforeEach(function(){
        module("FM.auth.google");
    });

    beforeEach(inject(function (_$rootScope_, $injector) {
        $rootScope = _$rootScope_;
        spyOn($rootScope, "isAuthenticatedGoogle").and.callThrough();

        $auth = $injector.get("$auth");
        $auth.getToken = function() {
            return true;
        }
        spyOn($auth, "getToken").and.callThrough();
    }));

    it("should check authenticated status", function() {
        var isAuth = $rootScope.isAuthenticatedGoogle();
        expect(isAuth).toBe(true);
    });

});
