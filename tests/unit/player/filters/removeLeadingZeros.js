"use strict";

describe("FM.player.removeLeadingZeros", function() {
    var $scope, filter;

    beforeEach(module("FM.player.removeLeadingZeros"));

    beforeEach(inject(function ($rootScope, $filter, $injector) {
        $scope = $rootScope.$new();
        filter = $filter("removeLeadingZeros");

    }));

    it("should filter times", function(){
        var result = filter("0:03:46");
        expect(result).toEqual("03:46");

        var result = filter("0:03:00");
        expect(result).toEqual("03:00");

        var result = filter("1:03:46");
        expect(result).toEqual("1:03:46");

        var result = filter("1:00:00");
        expect(result).toEqual("1:00:00");
    });

    it("should NOT filter times", function(){
        var result = filter("3:46");
        expect(result).toEqual("3:46");

        var result = filter("0:46");
        expect(result).toEqual("0:46");

        var result = filter(1);
        expect(result).toEqual(1);
    });


});
