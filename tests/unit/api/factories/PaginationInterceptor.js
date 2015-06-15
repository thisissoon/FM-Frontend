"use strict";

describe("FM.api.PaginationInterceptor", function (){
    var interceptor, httpProvider, rootScope;

    beforeEach(function (){
        module("FM.api.PaginationInterceptor", function ($httpProvider){
            httpProvider = $httpProvider;
        });
    });

    beforeEach(inject(function ( $rootScope, $injector ){

        rootScope = $rootScope;

        interceptor = $injector.get("PaginationInterceptor");
        spyOn(interceptor, "response").and.callThrough();

    }));

    it("$http service should contain response interceptor", function(){
        expect(httpProvider.interceptors).toContain("PaginationInterceptor");
    });

    it("should add pagination meta to response data", function(){
        var response = interceptor.response({ status: 200, config: {}, data: [{ name: "some name" }], headers: function(){ return "10" } })
        expect(response.data.meta.totalPages).toEqual(10);
        expect(response.data.meta.totalCount).toEqual(10);
    });

});

