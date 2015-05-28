"use strict";

describe("FM.search", function() {
    var $rootScope;

    beforeEach(function(){
        module("FM.search");
    });

    beforeEach(inject(function ( _$rootScope_) {
        $rootScope = _$rootScope_;

    }));

    beforeEach(inject(function ($httpBackend) {
        $httpBackend.whenGET(/.*/).respond(200);
    }));

    it("should toogle sidebar state", function() {
        expect($rootScope.sidebarOpen).toBe(false);
        $rootScope.toogleSidebar();
        expect($rootScope.sidebarOpen).toBe(true);

    });

});
