"use strict";

describe("sn.fm.player:app", function() {

    var $rootScope, $mdSidenav;

    beforeEach(function(){
        module("sn.fm.player");
    });

    beforeEach(inject(function ( _$rootScope_, $injector ) {
        $rootScope = _$rootScope_;
        $mdSidenav = $injector.get("$mdSidenav");
    }));

    it("should toogle sidenav", function() {
        var sidenav = $rootScope.toggleSideNav("foo");
        expect(sidenav).toEqual(jasmine.any(Object));
    })

    it("should close sidenav", function() {
        var sidenav = $rootScope.closeSideNav("foo");
        expect(sidenav).toEqual(jasmine.any(Object));
    })

    it("should open sidenav", function() {
        var sidenav = $rootScope.openSideNav("foo");
        expect(sidenav).toEqual(jasmine.any(Object));
    })
});
