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

        var today = new Date("2015-07-01");
        jasmine.clock().mockDate(today);

        DateUtils = $injector.get("DateUtils");
    }));


    describe("lastOccurence", function(){

        it("should return last occurence of specific day of the week", function(){
            jasmine.clock().tick(1);
            var lastFriday = DateUtils.lastOccurence(5);
            expect(lastFriday).toEqual(new Date("2015-07-03"));
        });

    });

    describe("historicDatePeriods", function(){

        it("should return historic date periods", function(){
            var dates = DateUtils.historicDatePeriods("2015-07-20", "2015-07-27", 3);
            expect(dates.length).toEqual(3);
            expect(dates[0].from).toEqual("2015-07-13");
            expect(dates[1].from).toEqual("2015-07-06");
            expect(dates[2].from).toEqual("2015-06-29");
            expect(dates[0].to).toEqual("2015-07-19");
            expect(dates[1].to).toEqual("2015-07-12");
            expect(dates[2].to).toEqual("2015-07-05");
        });

        it("should default end to today", function(){
            var dates = DateUtils.historicDatePeriods("2015-06-29", undefined, 1);
            expect(dates.length).toEqual(1);
            expect(dates[0].from).toEqual("2015-07-27");
            expect(dates[0].to).toEqual("2015-07-28");
        });

    });

});
