"use strict";

describe("FM.stats.DateUtils", function() {

    var $scope, DateUtils, LAST_WEEK;

    beforeEach(module("FM.stats.DateUtils"));

    beforeEach(module(function($provide) {
        $provide.value("LAST_WEEK", [
            new Date("2015-07-08"),
            new Date(new Date().setDate(new Date("2015-07-08").getDate() - 1)),
            new Date(new Date().setDate(new Date("2015-07-08").getDate() - 2)),
            new Date(new Date().setDate(new Date("2015-07-08").getDate() - 3)),
            new Date(new Date().setDate(new Date("2015-07-08").getDate() - 4)),
            new Date(new Date().setDate(new Date("2015-07-08").getDate() - 5)),
            new Date(new Date().setDate(new Date("2015-07-08").getDate() - 6))
        ]);
    }));

    beforeEach(inject(function ( $rootScope, $injector, $controller ) {
        $scope = $rootScope.$new();

        DateUtils = $injector.get("DateUtils");
    }));


    describe("lastOccurence", function(){

        it("should return last occurence of specific day of the week", function(){
            jasmine.clock().tick(1);
            var lastFriday = DateUtils.lastOccurence(5);
            expect(lastFriday).toEqual(new Date("2015-07-03"));
        });

    });

});
