"use strict";

describe("FM.api.TracksResource", function (){
    var $httpBackend, TracksResource;

    beforeEach(function (){
        module("FM.api.TracksResource");
    });

    beforeEach(inject(function ($injector){
        TracksResource = $injector.get("TracksResource");

        $httpBackend = $injector.get("$httpBackend");
        $httpBackend.whenGET(/.*/).respond({ id: 123 });
    }));

    it("should get volume", function(){
        var response = TracksResource.get();
        $httpBackend.flush();
        expect(response.id).toEqual(123);
    });

});

