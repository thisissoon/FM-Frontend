"use strict";

describe("FM.api.PlayerTransportResource", function (){
    var $httpBackend, PlayerTransportResource;

    beforeEach(function (){
        module("FM.api.PlayerTransportResource");
    });

    beforeEach(inject(function ( $injector, $resource ){
        $httpBackend = $injector.get("$httpBackend");
        PlayerTransportResource = $injector.get("PlayerTransportResource");

        $httpBackend.whenGET(/.*player\/current/).respond(200, { "name": "some track name" }, { "Paused": 1 });
    }));

    it("should add paused header to data", function(){
        var response = PlayerTransportResource.get();
        $httpBackend.flush();
        expect(response.paused).toEqual(true);
        expect(response.name).toEqual("some track name");
    });

});

