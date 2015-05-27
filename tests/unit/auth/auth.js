"use strict";

describe("FM.auth", function() {
    var $rootScope, $auth;

    beforeEach(function(){
        module("FM.auth");
    });

    beforeEach(inject(function (_$rootScope_, $injector) {
        $rootScope = _$rootScope_;
        spyOn($rootScope, "isAuthenticated").and.callThrough();

        $auth = $injector.get("$auth");
        $auth.getToken = function() {
            return true;
        }
        spyOn($auth, "getToken").and.callThrough();
    }));

    it("should check authenticated status", function() {
        var isAuth = $rootScope.isAuthenticated();
        expect(isAuth).toBe(true);
    });

});
