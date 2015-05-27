"use strict";

describe("FM.api.UsersResource", function (){
    var $httpBackend, UsersResource;

    beforeEach(function (){
        module("FM.api.UsersResource");
    });

    beforeEach(inject(function ($injector){
        UsersResource = $injector.get("UsersResource");

        $httpBackend = $injector.get("$httpBackend");
        $httpBackend.whenGET(/.*/).respond({ id: 123 });
    }));

    it("should get volume", function(){
        var response = UsersResource.get();
        $httpBackend.flush();
        expect(response.id).toEqual(123);
    });

});

