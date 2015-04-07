"use strict";

describe("sn.fm.api:RequestInterceptor", function (){
    var interceptor, httpProvider, $location, rootScope, resource, requestHandler, spy, FM_API_SERVER_ADDRESS;

    beforeEach(function (){
        module("sn.fm.api", function ($httpProvider){
            httpProvider = $httpProvider;
        });
    });

    beforeEach(inject(function ( $rootScope, $injector, $resource ){

        $rootScope.routeChanging = true;
        rootScope = $rootScope;

        FM_API_SERVER_ADDRESS = $injector.get("FM_API_SERVER_ADDRESS");

        interceptor = $injector.get("RequestInterceptor");

        $location = $injector.get("$location");
        spy = spyOn($location, "path");

    }));

    it("$http service should contain request interceptor", function(){
        expect(httpProvider.interceptors).toContain("RequestInterceptor");
    });

    it("should redirect to 500 page on response error", function(){
        interceptor.responseError({ status: 500, config: { url: FM_API_SERVER_ADDRESS } })
        expect($location.path).toHaveBeenCalledWith("/500");
    });

    it("should NOT redirect to 500 page on response success", function(){
        interceptor.responseError({ status: 200, config: { url: FM_API_SERVER_ADDRESS } })
        expect($location.path).not.toHaveBeenCalled();
    });

    it("should redirect to 401 page on 401 response status", function(){
        interceptor.responseError({ status: 401, config: { url: FM_API_SERVER_ADDRESS } })
        expect($location.path).toHaveBeenCalledWith("/401");
    });

    it("should NOT redirect to error pages if route is not changing", function(){
        rootScope.routeChanging = false;
        interceptor.responseError({ status: 401, config: { url: FM_API_SERVER_ADDRESS } })
        expect($location.path).not.toHaveBeenCalled();
    });

    it("should set Access-Token header from local storage", function(){
        localStorage.setItem("sn_fm_access_token", "mockAccessToken")
        var httpConfig = {
            url: FM_API_SERVER_ADDRESS,
            headers: {}
        };
        var request = interceptor.request(httpConfig);
        expect(request.headers["Access-Token"]).toEqual("mockAccessToken");
    });

    it("should NOT set Access-Token header if no token saved", function(){
        localStorage.clear();
        var httpConfig = {
            url: FM_API_SERVER_ADDRESS,
            headers: {}
        };
        var request = interceptor.request(httpConfig);
        expect(request.headers["Access-Token"]).toBe(undefined);
    });

});

