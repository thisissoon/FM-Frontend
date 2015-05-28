"use strict";

describe("FM.sockets", function() {
    var $rootScope, FM_SOCKET_EVENTS;

    beforeEach(function(){
        module("FM.sockets");
    });

    beforeEach(inject(function ( _$rootScope_, $injector) {
        $rootScope = _$rootScope_;
        FM_SOCKET_EVENTS = $injector.get("FM_SOCKET_EVENTS");

    }));

    beforeEach(inject(function ($httpBackend) {
        $httpBackend.whenGET(/.*/).respond(200);
    }));

    it("should have socket events", function() {
        expect(FM_SOCKET_EVENTS).toEqual(jasmine.any(Array));
    });

});
