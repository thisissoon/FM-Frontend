"use strict";

describe("FM.stats.statsResolver", function (){
    var statsResolver, StatsResource, DateUtils;

    beforeEach(module("FM.stats.statsResolver"));

    beforeEach(inject(function ( $injector, $route ){
        statsResolver = $injector.get("statsResolver");
        StatsResource = $injector.get("StatsResource");
        spyOn(StatsResource, "get").and.callThrough();

        DateUtils = $injector.get("DateUtils");
        DateUtils.lastOccurence = function () {
            // mock last Friday
            return new Date("2015-07-17");
        };

    }));

    it("should set filter params", function(){
        statsResolver({ to: "2015-07-10", from: "2015-07-06" });
        expect(StatsResource.get).toHaveBeenCalledWith({ to: "2015-07-10", from: "2015-07-06" });
    });

    it("should default filter params to last week", function(){
        statsResolver({});
        expect(StatsResource.get).toHaveBeenCalledWith({ to: "2015-07-17", from: "2015-07-10" });
    });

    it("should restrict max `to` date to last friday", function(){
        statsResolver({ to: "2015-07-24" });
        expect(StatsResource.get).toHaveBeenCalledWith({ to: "2015-07-17", from: "2015-07-10" });
    });

    it("should restrict max `from` date to last friday", function(){
        statsResolver({ from: "2015-08-10" });
        expect(StatsResource.get).toHaveBeenCalledWith({ to: "2015-07-17", from: "2015-07-10" });
    });

    it("should NOT default from if `all` param set", function(){
        statsResolver({ to: "2015-07-10", all: true });
        expect(StatsResource.get).toHaveBeenCalledWith({ to: "2015-07-10" });
    });

});

