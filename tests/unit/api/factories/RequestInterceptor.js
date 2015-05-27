"use strict";

describe("FM.api.RequestInterceptor", function (){
    var interceptor, httpProvider, $window, $location, rootScope, spy, FM_API_SERVER_ADDRESS;

    beforeEach(function (){
        module("FM.api.RequestInterceptor", function ($httpProvider){
            httpProvider = $httpProvider;
        });
    });

    beforeEach(inject(function ( $rootScope, $injector ){

        interceptor = $injector.get("RequestInterceptor");

        spyOn(interceptor, "request").and.callThrough();

        $rootScope.routeChanging = true;
        rootScope = $rootScope;

        $window = $injector.get("$window");

        $window.localStorage = {
            getItem: function(){ return "mockAccessToken" },
            setItem: function(){ return "mockAccessToken" },
            clear: function(){ return undefined }
        }
        spyOn($window.localStorage, "getItem").and.callThrough();

        FM_API_SERVER_ADDRESS = $injector.get("FM_API_SERVER_ADDRESS");

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

    // it("should set Access-Token header from local storage", function(){
    //     var httpConfig = {
    //         url: FM_API_SERVER_ADDRESS,
    //         headers: {}
    //     };
    //     var request = interceptor.request(httpConfig);
    //     expect($window.localStorage.getItem).toHaveBeenCalled();
    //     expect(request.headers["Access-Token"]).toEqual("mockAccessToken");
    // });

    it("should NOT set Access-Token header if no token saved", function(){
        $window.localStorage.clear();
        var httpConfig = {
            url: FM_API_SERVER_ADDRESS,
            headers: {}
        };
        var request = interceptor.request(httpConfig);
        expect(request.headers["Access-Token"]).toBe(undefined);
    });

    it("should NOT set Access-Token header if no token saved", function(){
        rootScope.$broadcast("$routeChangeStart");
        expect(rootScope.routeChanging).toBe(true);

        rootScope.$broadcast("$routeChangeSuccess");
        expect(rootScope.routeChanging).toBe(false);

        rootScope.$broadcast("$routeChangeStart");
        expect(rootScope.routeChanging).toBe(true);

        rootScope.$broadcast("$routeChangeError");
        expect(rootScope.routeChanging).toBe(false);
    });

});

