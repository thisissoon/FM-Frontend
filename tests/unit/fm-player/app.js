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
        var sidenav = $rootScope.toggleSidenav("foo");
        expect(sidenav).toEqual(jasmine.any(Object));
    })
});
