"use strict";

describe("FM.stats.statsResolver", function (){
    var statsResolver, resource, mockResource, DateUtils;

    beforeEach(module("FM.stats.statsResolver"));

    beforeEach(inject(function ( $injector, $route ){
        mockResource = function () {
            return {
                $promise: {}
            }
        };

        statsResolver = $injector.get("statsResolver");
        resource = jasmine.createSpy('resource').and.callFake(mockResource);

        DateUtils = $injector.get("DateUtils");
        DateUtils.lastOccurence = function () {
            // mock last Friday
            return new Date("2015-07-17");
        };

    }));

    it("should set filter params", function(){
        statsResolver(resource, { to: "2015-07-10", from: "2015-07-06" });
        expect(resource).toHaveBeenCalledWith({ to: "2015-07-10", from: "2015-07-06" });
    });

    it("should default filter params to last week", function(){
        statsResolver(resource, {});
        expect(resource).toHaveBeenCalledWith({ to: "2015-07-17", from: "2015-07-10" });
    });

    it("should restrict max `to` date to last friday", function(){
        statsResolver(resource, { to: "2015-07-24" });
        expect(resource).toHaveBeenCalledWith({ to: "2015-07-17", from: "2015-07-10" });
    });

    it("should restrict max `from` date to last friday", function(){
        statsResolver(resource, { from: "2015-08-10" });
        expect(resource).toHaveBeenCalledWith({ to: "2015-07-17", from: "2015-07-10" });
    });

    it("should NOT default from if `all` param set", function(){
        statsResolver(resource, { to: "2015-07-10", all: true });
        expect(resource).toHaveBeenCalledWith({ to: "2015-07-10" });
    });

});

