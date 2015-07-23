"use strict";

describe("FM.stats.timeFilter", function() {
    var $scope, filter;

    beforeEach(module("FM.stats.timeFilter"));

    beforeEach(inject(function ($rootScope, $filter, $injector) {
        $scope = $rootScope.$new();
        filter = $filter("time");

    }));

    it("should filter times", function(){
        var result = filter("60000");
        expect(result).toEqual("1m");

        var result = filter("3600000");
        expect(result).toEqual("1h 0m");

        var result = filter("3660000");
        expect(result).toEqual("1h 1m");

        var result = filter("86400000");
        expect(result).toEqual("1day 0h 0m");

        var result = filter("172800000");
        expect(result).toEqual("2days 0h 0m");
    });

});
