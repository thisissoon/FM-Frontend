"use strict";

describe("FM", function() {
    var route, rootScope, location;

    beforeEach(function(){
        module("FM");
    });

    beforeEach(inject(function (_$location_, _$route_, _$rootScope_) {
        location = _$location_;
        route = _$route_;
        rootScope = _$rootScope_;

    }));

    beforeEach(inject(function ($httpBackend) {
        $httpBackend.whenGET(/.*/).respond(200);
    }));

    it("should load views", function() {
        location.path("/401");
        rootScope.$digest();
        expect(route.current.controller).toBe(undefined);

        location.path("/500");
        rootScope.$digest();
        expect(route.current.controller).toBe(undefined);

    });

});
