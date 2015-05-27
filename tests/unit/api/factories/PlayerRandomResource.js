"use strict";

describe("FM.api.PlayerRandomResource", function (){
    var $httpBackend, PlayerRandomResource;

    beforeEach(function (){
        module("FM.api.PlayerRandomResource");
    });

    beforeEach(inject(function ($injector){
        PlayerRandomResource = $injector.get("PlayerRandomResource");

        $httpBackend = $injector.get("$httpBackend");
        $httpBackend.whenGET(/.*/).respond({ volume: 70 });
    }));

    it("should get volume", function(){
        var response = PlayerRandomResource.get();
        $httpBackend.flush();
        expect(response.volume).toEqual(70);
    });

});

