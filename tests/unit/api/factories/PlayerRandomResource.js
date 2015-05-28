"use strict";

describe("FM.api.PlayerRandomResource", function (){
    var $httpBackend, PlayerRandomResource;

    beforeEach(function (){
        module("FM.api.PlayerRandomResource");
    });

    beforeEach(inject(function ($injector){
        PlayerRandomResource = $injector.get("PlayerRandomResource");

        $httpBackend = $injector.get("$httpBackend");
        $httpBackend.whenPOST(/.*/).respond([{ track: { uri: "foo" } },{ track: { uri: "foo" } }]);
    }));

    it("should add random track to playlist", function(){
        var response = PlayerRandomResource.save();
        $httpBackend.flush();
        expect(response.length).toBe(2);
    });

});

