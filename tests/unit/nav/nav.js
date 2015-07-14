"use strict";

describe("FM", function() {
    var route, rootScope, location;

    beforeEach(function(){
        module("FM.nav");
    });

    beforeEach(inject(function (_$location_, _$rootScope_) {
        location = _$location_;
        rootScope = _$rootScope_;

        location.path = function(){
            return "/test"
        };
    }));

    beforeEach(inject(function ($httpBackend) {
        $httpBackend.whenGET(/.*/).respond(200);
    }));

    it("should check current route", function() {
        var isActive = rootScope.routeIsActive("/test");
        expect(isActive).toEqual(true);

        isActive = rootScope.routeIsActive("/random");
        expect(isActive).toEqual(false);
    });

});
