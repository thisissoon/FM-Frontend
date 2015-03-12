"use strict";

describe("sn.fm.api:RequestInterceptor", function (){
    var interceptor, httpProvider, $location, resource, requestHandler, spy;

    beforeEach(function (){
        module("sn.fm.api", function ($httpProvider){
            httpProvider = $httpProvider;
        });
    });

    beforeEach(inject(function ( $injector, $resource ){

        interceptor = $injector.get("RequestInterceptor");

        $location = $injector.get("$location");
        spy = spyOn($location, "path");

    }));

    it("$http service should contain request interceptor", function(){
        expect(httpProvider.interceptors).toContain("RequestInterceptor");
    });

    it("should redirect to 500 page on response error", function(){
        interceptor.responseError({ status: 500 })
        expect($location.path).toHaveBeenCalledWith("/500");
    });

    it("should NOT redirect to 500 page on response success", function(){
        interceptor.responseError({ status: 200 })
        expect($location.path).not.toHaveBeenCalled();
    });

});

